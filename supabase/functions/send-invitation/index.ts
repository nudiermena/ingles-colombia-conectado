import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  tenant_name: string;
  role: string;
  invitation_token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, tenant_name, role, invitation_token }: InvitationRequest = await req.json();

    console.log("Sending invitation email to:", email);

    const invitationUrl = `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '')}/accept-invitation?token=${invitation_token}`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Learning Platform <onboarding@resend.dev>",
        to: [email],
        subject: `You're invited to join ${tenant_name}`,
        html: `
          <h1>You've been invited!</h1>
          <p>You have been invited to join <strong>${tenant_name}</strong> as a <strong>${role}</strong>.</p>
          <p>Click the link below to accept your invitation:</p>
          <a href="${invitationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Accept Invitation
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${invitationUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        `,
      }),
    });

    const emailResult = await emailResponse.json();

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify(emailResult), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
