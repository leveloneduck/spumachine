-- Create table for storing multiple valid PINs
CREATE TABLE public.valid_pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pin_code TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.valid_pins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access (since this is for PIN verification)
CREATE POLICY "Allow all access to valid_pins" 
ON public.valid_pins 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_valid_pins_updated_at
BEFORE UPDATE ON public.valid_pins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default PIN from environment (if it exists)
-- This maintains backward compatibility
INSERT INTO public.valid_pins (pin_code, description) 
VALUES ('1234', 'Default PIN - Update this!')
ON CONFLICT (pin_code) DO NOTHING;