import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignalNotificationRequest {
  email: string;
  fullName: string;
  telephone: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  invitationCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      fullName, 
      telephone, 
      eventTitle, 
      eventDate, 
      eventLocation, 
      invitationCode 
    }: SignalNotificationRequest = await req.json();

    console.log("Sending signal notification for:", { email, fullName, eventTitle });

    // Send notification to admin using Brevo
    const adminEmailData = {
      sender: { name: "SCNRO Alerts", email: "alerts@scnro.live" },
      to: [{ email: "admin@scnro.live", name: "SCNRO Admin" }],
      subject: `New SIGNAL Alert Signup - ${eventTitle}`,
      htmlContent: `
        <h1>New SIGNAL Alert Signup</h1>
        <h2>Event: ${eventTitle}</h2>
        <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${eventLocation}</p>
        
        <h3>Participant Details:</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${telephone}</p>
        <p><strong>Invitation Code:</strong> ${invitationCode}</p>
        
        <p>This person has signed up for SIGNAL alerts and received their invitation code.</p>
      `
    };

    const adminNotification = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY!,
        "content-type": "application/json"
      },
      body: JSON.stringify(adminEmailData)
    });

    // Send confirmation to the user using Brevo
    const userEmailData = {
      sender: { name: "SCNRO", email: "noreply@scnro.live" },
      to: [{ email: email, name: fullName }],
      subject: `SIGNAL Alert Confirmed - ${eventTitle}`,
      htmlContent: `
        <h1>SIGNAL Alert Confirmed</h1>
        <p>Hi ${fullName},</p>
        
        <p>You've successfully signed up for SIGNAL alerts for <strong>${eventTitle}</strong>.</p>
        
        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Your Invitation Code: <span style="color: #6366f1; font-family: monospace;">${invitationCode}</span></h2>
          <p>Keep this code safe - you'll need it when the event is announced.</p>
        </div>
        
        <h3>Event Details:</h3>
        <p><strong>Event:</strong> ${eventTitle}</p>
        <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${eventLocation}</p>
        
        <p>We'll notify you when new SIGNAL events drop. Stay tuned!</p>
        
        <p>Best,<br>The SCNRO Team</p>
      `
    };

    const userConfirmation = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY!,
        "content-type": "application/json"
      },
      body: JSON.stringify(userEmailData)
    });

    const adminResponse = await adminNotification.json();
    const userResponse = await userConfirmation.json();

    console.log("Admin notification sent:", adminResponse);
    console.log("User confirmation sent:", userResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminNotification: adminResponse, 
        userConfirmation: userResponse 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-signal-notification function:", error);
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