// @ts-nocheck
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const raw = await req.text();
    if (!raw.trim()) {
      return new Response(JSON.stringify({ error: "empty body" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
    }

    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      return new Response(JSON.stringify({ error: "invalid JSON" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
    }

    // Database webhooks send { type, table, schema, record, old_record }
    // Support other shapes too: new, data.new, direct row
    const record = payload?.record ?? payload?.new ?? payload?.data?.new ?? payload?.data ?? payload;

    const title = record?.title || "New notification";
    const body = record?.body || "(no body)";
    const metadata = record?.metadata ?? {};

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("send-notification-email: missing RESEND_API_KEY");
      return new Response(JSON.stringify({ error: "Resend API key not configured" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
    }

    const resendFrom = Deno.env.get("RESEND_FROM") || "Portfolio <onboarding@resend.dev>";
    const notifyTo = Deno.env.get("NOTIFY_TO") || "chekolengusalem@gmail.com";

    const metaLines = Object.entries(metadata).map(([k, v]) => `<strong>${k}:</strong> ${String(v)}`).join("<br />");

    const html = `
      <h2>${title}</h2>
      <p>${body.replace(/\n/g, "<br />")}</p>
      <hr />
      <div>${metaLines}</div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFrom,
        to: notifyTo,
        subject: title,
        html,
      }),
    });

    const jr = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("resend error", jr);
      return new Response(JSON.stringify({ error: "Resend API error", detail: jr }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
    }

    return new Response(JSON.stringify({ success: true, id: jr.id ?? null }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (err) {
    console.error("send-notification-email error", String(err));
    return new Response(JSON.stringify({ error: String(err) }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
