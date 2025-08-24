import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

interface VerifyPinRequest {
  pin: string;
  browserFingerprint: string;
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
    
    // Extract IP address from request headers (server-side detection)
    const ipAddress = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const { pin, browserFingerprint, userAgent }: VerifyPinRequest = await req.json();

    // Enhanced progressive rate limiting
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    const { data: recentAttempts, error: rateLimitError } = await supabase
      .from('access_logs')
      .select('*')
      .eq('ip_address', ipAddress)
      .eq('success', false)
      .gte('attempted_at', oneHourAgo.toISOString());

    const { data: veryRecentAttempts, error: shortTermError } = await supabase
      .from('access_logs')
      .select('*')
      .eq('ip_address', ipAddress)
      .eq('success', false)
      .gte('attempted_at', tenMinutesAgo.toISOString());

    if (rateLimitError || shortTermError) {
      console.error('Rate limit check error:', rateLimitError || shortTermError);
    }

    // Progressive rate limiting: 3 in 10 minutes = immediate block, 5 in hour = block
    if ((veryRecentAttempts && veryRecentAttempts.length >= 3) || 
        (recentAttempts && recentAttempts.length >= 5)) {
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
    
    // Enhanced security logging (without exposing sensitive data)
    console.log('PIN validation attempt:', { 
      pinLength: pin.length,
      fingerprint: browserFingerprint.substring(0, 8) + '***',
      ipAddress: ipAddress.includes(':') ? '[IPv6]' : ipAddress.replace(/\.\d+$/, '.***'),
      isCorrect,
      timestamp: new Date().toISOString()
    });

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

    // Create session token with shorter duration (4 hours)
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 4);

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