import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScnroSchoolsNotificationRequest {
  schoolName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  schoolType: string;
  studentCount: number;
  preferredStartDate?: string;
  additionalInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      schoolName, 
      contactName, 
      contactEmail, 
      contactPhone, 
      schoolType, 
      studentCount, 
      preferredStartDate, 
      additionalInfo 
    }: ScnroSchoolsNotificationRequest = await req.json();

    console.log("Sending SCNRO Schools registration emails for:", schoolName);

    // Send notification to admin
    await resend.emails.send({
      from: "SCNRO Education <noreply@send.scenarioarts.co.uk>",
      to: ["admin@scenarioarts.co.uk"],
      subject: "New School Registration - Mental Toughness Programme",
      html: `
        <h2>New School/College Registration</h2>
        <p><strong>School/College:</strong> ${schoolName}</p>
        <p><strong>Type:</strong> ${schoolType}</p>
        <p><strong>Contact Name:</strong> ${contactName}</p>
        <p><strong>Contact Email:</strong> ${contactEmail}</p>
        <p><strong>Contact Phone:</strong> ${contactPhone}</p>
        <p><strong>Number of Students:</strong> ${studentCount}</p>
        <p><strong>Preferred Start Date:</strong> ${preferredStartDate || 'Not specified'}</p>
        <p><strong>Additional Information:</strong></p>
        <p>${additionalInfo || 'None provided'}</p>
        <p><strong>Registered:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
      `,
    });

    // Send confirmation to school contact
    await resend.emails.send({
      from: "SCNRO Education <noreply@send.scenarioarts.co.uk>",
      to: [contactEmail],
      subject: "Mental Toughness in Education - School Registration Confirmed",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Thank you for your interest, ${contactName}!</h2>
          
          <p>We've received your school registration for the <strong>Mental Toughness in Education Programme</strong> from <strong>${schoolName}</strong>.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Programme Overview</h3>
            <p><strong>Target Group:</strong> Years 10–13 (ages 14–19)</p>
            <p><strong>Delivery Format:</strong> 6 consecutive sessions – group and 1:1 coaching</p>
            <p><strong>Location:</strong> Central Newham venue or hosted on-site</p>
            <p><strong>Group Size:</strong> 10 students per cohort</p>
          </div>
          
          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Registration Details</h3>
            <p><strong>Number of Students:</strong> ${studentCount}</p>
            <p><strong>Preferred Start:</strong> ${preferredStartDate || 'To be discussed'}</p>
          </div>
          
          <h3>What Happens Next?</h3>
          <p>Our education team will contact you within 2-3 working days to discuss:</p>
          <ul>
            <li>Tailored programme schedule and dates</li>
            <li>Pricing options (Partner School or Member School rates)</li>
            <li>Student selection and consent process</li>
            <li>On-site vs central venue delivery</li>
            <li>Optional staff CPD opportunities</li>
          </ul>
          
          <h3>Programme Components</h3>
          <ul>
            <li>Two professional MTQ Assessments (measure mindset & progress)</li>
            <li>1:1 feedback and coaching sessions for each student</li>
            <li>The 4C's Framework: Control • Commitment • Challenge • Confidence</li>
            <li>Final reflection and progress report for each learner</li>
          </ul>
          
          <p style="margin-top: 30px;">If you have any questions, please contact us at <a href="mailto:admin@scenarioarts.co.uk">admin@scenarioarts.co.uk</a></p>
          
          <p style="margin-top: 30px;">
            <strong>Scenario Arts</strong><br>
            UK Charity Reg. 1203542<br>
            Empowering Students Through Mental Toughness<br>
            <a href="https://scnro.live">scnro.live</a>
          </p>
        </div>
      `,
    });

    console.log("SCNRO Schools registration emails sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-scnro-schools-notification:", error);
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
