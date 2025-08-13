import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPinRequest {
  pin: string;
  browserFingerprint: string;
  ipAddress: string;
  userAgent?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { pin, browserFingerprint, ipAddress, userAgent }: VerifyPinRequest = await req.json();

    // Check rate limiting - max 3 attempts per hour per IP
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const { data: recentAttempts, error: rateLimitError } = await supabase
      .from('access_logs')
      .select('*')
      .eq('ip_address', ipAddress)
      .eq('success', false)
      .gte('attempted_at', oneHourAgo.toISOString());

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if (recentAttempts && recentAttempts.length >= 3) {
      // Log the rate-limited attempt
      await supabase.from('access_logs').insert({
        ip_address: ipAddress,
        browser_fingerprint: browserFingerprint,
        success: false,
        user_agent: userAgent || 'Unknown'
      });

      return new Response(
        JSON.stringify({ error: 'Too many failed attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if PIN exists in database and is active
    const { data: validPin, error: pinCheckError } = await supabase
      .from('valid_pins')
      .select('pin_code')
      .eq('pin_code', pin)
      .eq('is_active', true)
      .single();

    if (pinCheckError && pinCheckError.code !== 'PGRST116') {
      console.error('PIN check error:', pinCheckError);
      return new Response(
        JSON.stringify({ error: 'Authentication system error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isCorrect = !!validPin;

    // Log the attempt
    const { error: logError } = await supabase.from('access_logs').insert({
      ip_address: ipAddress,
      browser_fingerprint: browserFingerprint,
      success: isCorrect,
      user_agent: userAgent || 'Unknown'
    });

    if (logError) {
      console.error('Failed to log attempt:', logError);
    }

    if (!isCorrect) {
      return new Response(
        JSON.stringify({ error: 'Incorrect PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { error: sessionError } = await supabase.from('active_sessions').insert({
      session_token: sessionToken,
      browser_fingerprint: browserFingerprint,
      ip_address: ipAddress,
      expires_at: expiresAt.toISOString()
    });

    if (sessionError) {
      console.error('Failed to create session:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionToken,
        expiresAt: expiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verify PIN error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});