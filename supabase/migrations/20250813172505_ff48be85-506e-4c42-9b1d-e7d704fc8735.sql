-- Create access_logs table to track PIN attempts
CREATE TABLE public.access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  browser_fingerprint TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT
);

-- Create active_sessions table for session management
CREATE TABLE public.active_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  browser_fingerprint TEXT NOT NULL,
  ip_address INET NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- Enable Row Level Security
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is a PIN-based system, not user-based)
CREATE POLICY "Allow all access to access_logs" 
ON public.access_logs 
FOR ALL 
USING (true);

CREATE POLICY "Allow all access to active_sessions" 
ON public.active_sessions 
FOR ALL 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_access_logs_ip_time ON public.access_logs (ip_address, attempted_at);
CREATE INDEX idx_active_sessions_token ON public.active_sessions (session_token);
CREATE INDEX idx_active_sessions_expires ON public.active_sessions (expires_at);