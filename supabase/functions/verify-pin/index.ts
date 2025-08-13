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

    // Check PIN against PIN_ONE through PIN_EIGHT secrets
    const validPins = [
      Deno.env.get('PIN_ONE'),
      Deno.env.get('PIN_TWO'), 
      Deno.env.get('PIN_THREE'),
      Deno.env.get('PIN_FOUR'),
      Deno.env.get('PIN_FIVE'),
      Deno.env.get('PIN_SIX'),
      Deno.env.get('PIN_SEVEN'),
      Deno.env.get('PIN_EIGHT')
    ].filter(Boolean); // Remove undefined values

    const isCorrect = validPins.includes(pin);
    console.log('PIN validation attempt:', { pin: pin.substring(0, 2) + '***', isCorrect });

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