-- Fix critical security vulnerabilities by implementing proper RLS policies

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow all access to valid_pins" ON public.valid_pins;
DROP POLICY IF EXISTS "Allow all access to active_sessions" ON public.active_sessions;  
DROP POLICY IF EXISTS "Allow all access to access_logs" ON public.access_logs;

-- Create secure policies that only allow service role access
-- These tables should only be accessible by Edge Functions using service role key

-- Valid PINs - Only service role can access (Edge Functions only)
CREATE POLICY "Service role only access to valid_pins" 
ON public.valid_pins 
FOR ALL 
TO service_role 
USING (true);

-- Active Sessions - Only service role can access (Edge Functions only) 
CREATE POLICY "Service role only access to active_sessions"
ON public.active_sessions
FOR ALL  
TO service_role
USING (true);

-- Access Logs - Only service role can access (Edge Functions only)
CREATE POLICY "Service role only access to access_logs"
ON public.access_logs
FOR ALL
TO service_role  
USING (true);

-- Ensure RLS is enabled on all tables (should already be enabled)
ALTER TABLE public.valid_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;