import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface SendEmailRequest {
  type: "contact" | "chat"; // "contact" for HireMe form, "chat" for user messages
  senderEmail: string;
  senderName: string;
  subject: string;
  message: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, senderEmail, senderName, subject, message }: SendEmailRequest =
      await req.json();

    if (!type || !senderEmail || !senderName || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required email fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resendFrom = Deno.env.get("RESEND_FROM") || "Portfolio <onboarding@resend.dev>";

    const recipientEmail = "chekolengusalem@gmail.com";

    // Format email content based on type
    let emailBody = "";
    if (type === "contact") {
      emailBody = `
New Contact Form Submission

From: ${senderName} (${senderEmail})
Subject: ${subject}

Message:
${message}
      `.trim();
    } else if (type === "chat") {
      emailBody = `
New Chat Message from Your Portfolio

From: ${senderName} (${senderEmail})

Message:
${message}
      `.trim();
    }

    // Send via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFrom,
        to: recipientEmail,
        replyTo: senderEmail,
        subject: type === "contact" ? `New Contact: ${subject}` : `New Chat: ${senderName}`,
        html: `
          <h2>${type === "contact" ? "Contact Form" : "Chat Message"}</h2>
          <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
          <hr />
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    const resendResponse = await response.json();

    if (!response.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(resendResponse)}`);
    }

    return new Response(
      JSON.stringify({ success: true, messageId: resendResponse.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("send-email error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
