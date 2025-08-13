import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidateSessionRequest {
  sessionToken: string;
  browserFingerprint: string;
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
    
    const { sessionToken, browserFingerprint }: ValidateSessionRequest = await req.json();

    // Clean up expired sessions first
    await supabase
      .from('active_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());

    // Validate session
    const { data: session, error } = await supabase
      .from('active_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('browser_fingerprint', browserFingerprint)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      return new Response(
        JSON.stringify({ valid: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        valid: true,
        expiresAt: session.expires_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Validate session error:', error);
    return new Response(
      JSON.stringify({ valid: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});