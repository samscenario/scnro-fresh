import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CampusInquiryRequest {
  name: string;
  email: string;
  university: string;
  position: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, university, position, message }: CampusInquiryRequest = await req.json();

    console.log("Received campus inquiry from:", { name, email, university, position });

    // Send confirmation email to the inquirer
    const confirmationEmail = await resend.emails.send({
      from: "SCNRO <noreply@resend.dev>",
      to: [email],
      subject: "We received your campus hosting inquiry!",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: bold; margin: 0;">
              SCNRO
            </h1>
          </div>
          
          <h2 style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">Thanks for your interest, ${name}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We've received your inquiry about bringing SCNRO to <strong>${university}</strong>. 
            Our team will review your submission and get back to you within 2-3 business days.
          </p>
          
          <div style="background: rgba(0, 255, 136, 0.1); border-left: 4px solid #00ff88; padding: 20px; margin: 30px 0;">
            <h3 style="color: #00ff88; margin-top: 0;">What happens next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Our campus partnerships team will review your application</li>
              <li>We'll schedule a call to discuss logistics and requirements</li>
              <li>Together, we'll plan an unforgettable SCNRO experience for your campus</li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #888; margin-top: 40px; text-align: center;">
            Follow us for updates: 
            <a href="#" style="color: #00d4ff; text-decoration: none;">@scnro</a>
          </p>
        </div>
      `,
    });

    // Send notification email to SCNRO team
    const notificationEmail = await resend.emails.send({
      from: "SCNRO Campus Inquiries <noreply@resend.dev>",
      to: ["campus@scnro.com"], // Replace with actual team email
      subject: `New Campus Hosting Inquiry - ${university}`,
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #00ff88; border-bottom: 2px solid #00ff88; padding-bottom: 10px;">
            New Campus Hosting Inquiry
          </h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">Contact Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>University:</strong> ${university}</p>
            <p><strong>Position:</strong> ${position}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Please follow up within 2-3 business days to maintain our response time commitment.
          </p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { confirmationEmail, notificationEmail });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Inquiry submitted successfully" 
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
    console.error("Error in send-campus-inquiry function:", error);
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