import React, { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import MetallicKeypad from '@/components/MetallicKeypad';
import { usePinAuth } from '@/contexts/PinAuthContext';
const PinCodeOverlay: React.FC = () => {
  const [pin, setPin] = useState('');
  const {
    verifyPin,
    isLoading,
    error
  } = usePinAuth();
  const handleNumberClick = (number: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + number);
    }
  };
  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };
  const handleClear = () => {
    setPin('');
  };
  const handleSubmit = async () => {
    if (pin.length >= 4) {
      await verifyPin(pin);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleNumberClick(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Enter' && pin.length >= 4) {
      handleSubmit();
    }
  };
  return <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            <div>Spare Parts Universe</div>
            <div className="text-3xl">Exclusive Access Only</div>
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter PIN to continue
          </p>
        </div>

        {/* PIN Display */}
        <div className="mb-8 flex justify-center">
          <InputOTP maxLength={6} value={pin} onChange={setPin} className="gap-2">
            <InputOTPGroup>
              {Array.from({
              length: 6
            }).map((_, index) => <InputOTPSlot key={index} index={index} className="w-14 h-14 text-2xl border-2 border-border/50 
                           bg-gradient-to-b from-muted/10 to-muted/20 
                           data-[active=true]:border-primary data-[active=true]:shadow-glow-neo/30
                           transition-all duration-200" />)}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Error Message */}
        {error && <div className="mb-6 p-3 rounded-md bg-destructive/20 border border-destructive/50 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>}

        {/* Metallic Keypad */}
        <div className="mb-8">
          <MetallicKeypad onNumberClick={handleNumberClick} onBackspace={handleBackspace} onClear={handleClear} disabled={isLoading} />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={pin.length < 4 || isLoading} className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow 
                     hover:shadow-glow-neo/30 transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              VERIFYING...
            </> : 'UNLOCK ACCESS'}
        </Button>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Use physical or on-screen keypad • 4-6 digits required
        </div>
      </div>
    </div>;
};
export default PinCodeOverlay;