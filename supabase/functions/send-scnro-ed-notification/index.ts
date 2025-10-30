import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScnroEdNotificationRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  addressNewham: string;
  previousExperience?: string;
  motivation: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fullName, email, phoneNumber, age, addressNewham, previousExperience, motivation }: ScnroEdNotificationRequest = await req.json();

    console.log("Sending SCNRO ED registration emails for:", email);

    // Send notification to admin
    await resend.emails.send({
      from: "SCNRO Education <noreply@send.scenarioarts.co.uk>",
      to: ["admin@scenarioarts.co.uk"],
      subject: "New SCNRO Education Programme Registration",
      html: `
        <h2>New SCNRO Education Programme Registration</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Address in Newham:</strong> ${addressNewham}</p>
        <p><strong>Previous Experience:</strong> ${previousExperience || 'Not provided'}</p>
        <p><strong>Motivation:</strong> ${motivation}</p>
        <p><strong>Registered:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
      `,
    });

    // Send confirmation to participant
    await resend.emails.send({
      from: "SCNRO Education <noreply@send.scenarioarts.co.uk>",
      to: [email],
      subject: "SCNRO Mental Toughness Programme - Registration Confirmed",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Thank you for registering, ${fullName}!</h2>
          
          <p>We've received your registration for the <strong>SCNRO 6-Week Mental Toughness & Performing Arts Programme</strong>.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Programme Details</h3>
            <p><strong>Venue:</strong> Newham Sixth Form College Theatre Space</p>
            <p><strong>Ages:</strong> 16–19 (living, working, or studying in Newham)</p>
            <p><strong>Cost:</strong> £10 per session or £50 for all 6 sessions (if paid in advance)</p>
            <p style="font-style: italic;">Scholarships available for low-income participants</p>
          </div>
          
          <h3>What Happens Next?</h3>
          <p>Our team will review your registration and contact you within 2-3 working days with:</p>
          <ul>
            <li>Programme start dates and schedule</li>
            <li>Payment information</li>
            <li>Scholarship application details (if needed)</li>
            <li>What to expect and bring to your first session</li>
          </ul>
          
          <p style="margin-top: 30px;">If you have any questions, please contact us at <a href="mailto:admin@scenarioarts.co.uk">admin@scenarioarts.co.uk</a></p>
          
          <p style="margin-top: 30px;">
            <strong>SCNRO Collective</strong><br>
            "Confidence in Self. Confidence in Life."<br>
            <a href="https://scnro.live">scnro.live</a>
          </p>
        </div>
      `,
    });

    console.log("SCNRO ED registration emails sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-scnro-ed-notification:", error);
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
