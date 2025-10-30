import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertSignupRequest {
  email: string;
  fullName?: string;
  phone?: string;
  subscriptionTypes: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing alert signup request...');
    
    const { email, fullName, phone, subscriptionTypes }: AlertSignupRequest = await req.json();

    // Validate required fields
    if (!email || !subscriptionTypes || subscriptionTypes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Email and subscription types are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert or update subscription
    const { data: subscription, error: dbError } = await supabase
      .from('alert_subscriptions')
      .upsert({
        email,
        full_name: fullName,
        phone,
        subscription_types: subscriptionTypes,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save subscription' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Send confirmation email via BREVO
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    if (brevoApiKey) {
      try {
        console.log('Sending confirmation email to:', email);
        const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            sender: {
              name: 'SCNRO Team',
              email: 'noreply@scnro.live'
            },
            to: [{
              email: email,
              name: fullName || 'Subscriber'
            }],
            subject: 'Welcome to SCNRO Alerts! 🔥',
            htmlContent: `
              <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ffffff;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #ff0080; font-size: 32px; font-weight: bold; margin: 0;">SCNRO</h1>
                    <h2 style="color: #00ffff; font-size: 24px; margin: 10px 0;">Alert Subscription Confirmed!</h2>
                  </div>
                  
                  <div style="background: linear-gradient(135deg, #1a1a1a, #2a2a2a); padding: 25px; border-radius: 15px; border: 2px solid #ff0080;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hey ${fullName || 'there'}! 👋</p>
                    
                    <p>You're now subscribed to SCNRO alerts for:</p>
                    <ul style="color: #00ffff; font-weight: bold; margin: 15px 0;">
                      ${subscriptionTypes.map(type => `<li style="margin: 5px 0;">${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>`).join('')}
                    </ul>
                    
                    <p>Get ready for:</p>
                    <ul style="margin: 15px 0;">
                      <li>🎵 Exclusive signal show announcements</li>
                      <li>🎪 Event alerts and early access</li>
                      <li>🛍️ Limited-edition merchandise drops</li>
                      <li>🔥 Behind-the-scenes content</li>
                    </ul>
                    
                    <p style="margin-top: 25px; font-style: italic; color: #888;">
                      Stay connected, stay creative, stay SCNRO.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666;">
                    <p>Follow us for more updates:</p>
                    <p>🌐 scenarioarts.co.uk | 📱 @scnro_official</p>
                  </div>
                </body>
              </html>
            `
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error('BREVO email error:', errorText);
          console.error('Response status:', emailResponse.status);
        } else {
          console.log('Confirmation email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    // Send admin notification email
    if (brevoApiKey) {
      try {
        console.log('Sending admin notification email');
        const adminEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            sender: {
              name: 'SCNRO System',
              email: 'alerts@scnro.live'
            },
            to: [{
              email: 'admin@scnro.live',
              name: 'SCNRO Admin'
            }],
            subject: 'New Alert Subscription - SCNRO',
            htmlContent: `
              <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #ff0080;">New Alert Subscription</h2>
                  <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Name:</strong> ${fullName || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Subscription Types:</strong></p>
                    <ul>
                      ${subscriptionTypes.map(type => `<li>${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>`).join('')}
                    </ul>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                  </div>
                </body>
              </html>
            `
          }),
        });

        if (!adminEmailResponse.ok) {
          const errorText = await adminEmailResponse.text();
          console.error('Admin notification email error:', errorText);
          console.error('Admin email response status:', adminEmailResponse.status);
        } else {
          console.log('Admin notification email sent successfully');
        }
      } catch (adminEmailError) {
        console.error('Error sending admin notification email:', adminEmailError);
      }
    }

    // Create admin dashboard notification
    await supabase
      .from('admin_notifications')
      .insert({
        title: 'New Alert Subscription',
        message: `${fullName || email} subscribed to ${subscriptionTypes.length} alert type(s)`,
        notification_type: 'alert_signup',
        related_email: email,
        metadata: {
          subscription_types: subscriptionTypes,
          full_name: fullName,
          phone: phone
        }
      });

    console.log('Alert signup processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed to alerts',
        subscription_id: subscription.id 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('Error in handle-alert-signup function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);