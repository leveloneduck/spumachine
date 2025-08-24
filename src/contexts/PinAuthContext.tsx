import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBrowserFingerprint } from '@/hooks/useBrowserFingerprint';

interface PinAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const PinAuthContext = createContext<PinAuthContextType | undefined>(undefined);

export const usePinAuth = () => {
  const context = useContext(PinAuthContext);
  if (!context) {
    throw new Error('usePinAuth must be used within PinAuthProvider');
  }
  return context;
};

interface PinAuthProviderProps {
  children: ReactNode;
}

export const PinAuthProvider: React.FC<PinAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fingerprint = useBrowserFingerprint();

  useEffect(() => {
    if (!fingerprint) return;

    const checkExistingSession = async () => {
      const sessionToken = localStorage.getItem('pin_session_token');
      if (!sessionToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('validate-session', {
          body: {
            sessionToken,
            browserFingerprint: fingerprint
          }
        });

        if (error || !data?.valid) {
          localStorage.removeItem('pin_session_token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Session validation error:', err);
        localStorage.removeItem('pin_session_token');
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkExistingSession();
  }, [fingerprint]);

  const verifyPin = async (pin: string): Promise<boolean> => {
    if (!fingerprint) return false;
    
    setError(null);
    setIsLoading(true);

    try {
      // Server will extract IP from headers - no external API needed
      const { data, error } = await supabase.functions.invoke('verify-pin', {
        body: {
          pin,
          browserFingerprint: fingerprint,
          userAgent: navigator.userAgent
        }
      });

      if (error || !data?.success) {
        setError(data?.error || 'Invalid PIN');
        setIsLoading(false);
        return false;
      }

      localStorage.setItem('pin_session_token', data.sessionToken);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('PIN verification error:', err);
      setError('Network error. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    const sessionToken = localStorage.getItem('pin_session_token');
    
    // Clean up session on server if possible
    if (sessionToken && fingerprint) {
      try {
        await supabase.functions.invoke('invalidate-session', {
          body: {
            sessionToken,
            browserFingerprint: fingerprint
          }
        });
      } catch (err) {
        console.error('Session invalidation error:', err);
      }
    }
    
    localStorage.removeItem('pin_session_token');
    setIsAuthenticated(false);
  };

  return (
    <PinAuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      verifyPin,
      logout,
      error
    }}>
      {children}
    </PinAuthContext.Provider>
  );
};