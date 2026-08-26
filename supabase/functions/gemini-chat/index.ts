// @ts-nocheck
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });

  try {
    const raw = await req.text();
    if (!raw.trim()) return json({ error: "empty body" }, 400);

    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      return json({ error: "invalid JSON" }, 400);
    }

    const messages = payload?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "messages must be a non-empty array" }, 400);
    }

    // Key stays server-side: set with `supabase secrets set GEMINI_API_KEY=...`
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      console.error("gemini-chat: missing GEMINI_API_KEY");
      return json({ error: "Gemini API key not configured" }, 500);
    }

    const model = Deno.env.get("GEMINI_MODEL") || "gemini-3.5-flash";

    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${geminiApiKey}`,
      },
      body: JSON.stringify({ model, messages }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("gemini error", res.status, data);
      return json(data ?? { error: "Gemini API error" }, res.status);
    }

    return json(data, 200);
  } catch (err) {
    console.error("gemini-chat error", String(err));
    return json({ error: String(err) }, 500);
  }
});
