import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

interface InvalidateSessionRequest {
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
    
    const { sessionToken, browserFingerprint }: InvalidateSessionRequest = await req.json();

    // Delete the specific session
    const { error } = await supabase
      .from('active_sessions')
      .delete()
      .eq('session_token', sessionToken)
      .eq('browser_fingerprint', browserFingerprint);

    if (error) {
      console.error('Failed to invalidate session:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to invalidate session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Also clean up expired sessions while we're here
    await supabase
      .from('active_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Invalidate session error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});