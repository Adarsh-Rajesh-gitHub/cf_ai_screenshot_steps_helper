import { DurableObject } from "cloudflare:workers";

export type Brain = {
  screen_summary: string;
  ui_elements: Array<{ label: string; type: string; hint: string }>;
  steps: string[];
  confidence: number;
  need_new_screenshot: boolean;
  expected_next_screen: string;
};

export type SessionState = {
  last_image_hash: string | null;
  last_result_json: Brain | null;
  expected_next_screen: string | null;
  step_index: number;
  history: Array<{
    ts: number;
    goal: string;
    image_hash: string;
    brain: Brain;
  }>;
};

const DEFAULT_STATE: SessionState = {
  last_image_hash: null,
  last_result_json: null,
  expected_next_screen: null,
  step_index: 0,
  history: []
};

export class SessionMemoryDO extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/session") {
      const s = await this.readState();
      return Response.json({ ok: true, session: s });
    }

    // POST /session/update -> store capture result
    if (request.method === "POST" && url.pathname === "/session/update") {
      const body = (await request.json()) as {
        goal: string;
        image_hash: string;
        brain: Brain;
      };

      const s = await this.readState();

      const next: SessionState = {
        ...s,
        last_image_hash: body.image_hash,
        last_result_json: body.brain,
        expected_next_screen: body.brain.expected_next_screen ?? null,
        step_index: 0,
        history: [
          ...s.history,
          {
            ts: Date.now(),
            goal: body.goal,
            image_hash: body.image_hash,
            brain: body.brain
          }
        ].slice(-10) // cap to last 10
      };

      await this.ctx.storage.put("state", next);
      return Response.json({ ok: true });
    }

    // POST /session/reset -> clears everything atomically
    if (request.method === "POST" && url.pathname === "/session/reset") {
      await this.ctx.storage.put("state", DEFAULT_STATE);
      return Response.json({ ok: true });
    }

    // POST /session/step -> update step_index (optional utility)
    if (request.method === "POST" && url.pathname === "/session/step") {
      const body = (await request.json()) as { step_index: number };
      const s = await this.readState();
      const next = { ...s, step_index: Math.max(0, body.step_index | 0) };
      await this.ctx.storage.put("state", next);
      return Response.json({ ok: true });
    }

    return new Response("Not found", { status: 404 });
  }

  private async readState(): Promise<SessionState> {
    const stored = await this.ctx.storage.get<SessionState>("state");
    return stored ?? DEFAULT_STATE;
  }
}