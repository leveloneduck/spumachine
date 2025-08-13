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
  return <div className="fixed inset-0 z-50 flex items-center justify-center 
                         bg-gradient-to-br from-[hsl(var(--metal-dark))] via-[hsl(var(--metal-base))] to-[hsl(var(--metal-dark))]
                         relative overflow-hidden
                         before:absolute before:inset-0 before:bg-gradient-to-tr before:from-[hsl(var(--rust-dark)/0.4)] before:via-transparent before:to-[hsl(var(--rust-base)/0.3)]
                         after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_20%,hsl(var(--rust-base)/0.2)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,hsl(var(--rust-dark)/0.3)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,hsl(var(--metal-light)/0.1)_0%,transparent_50%)]" 
                         onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="w-full max-w-md mx-auto p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 font-mono tracking-wider drop-shadow-2xl">
            <div className="bg-gradient-to-r from-[hsl(var(--amber-display))] to-[hsl(var(--amber-glow))] bg-clip-text text-transparent 
                           filter drop-shadow-[0_0_8px_hsl(var(--amber-glow)/0.5)] animate-pulse">
              SPARE PARTS UNIVERSE
            </div>
            <div className="text-2xl text-[hsl(var(--rust-light))] mt-1 font-semibold tracking-wide
                           filter drop-shadow-[0_0_4px_hsl(var(--rust-glow)/0.3)]">
              EXCLUSIVE ACCESS ONLY
            </div>
          </h1>
          <p className="text-[hsl(var(--steel-light))] text-lg font-mono uppercase tracking-widest
                     border-l-4 border-[hsl(var(--rust-base))] pl-3 bg-[hsl(var(--metal-base)/0.3)] py-1">
            ⚠ ENTER SECURITY PIN ⚠
          </p>
        </div>

        {/* PIN Display - Industrial Metal Screens */}
        <div className="mb-8 flex justify-center">
          <InputOTP maxLength={6} value={pin} onChange={setPin} className="gap-3">
            <InputOTPGroup>
              {Array.from({
              length: 6
            }).map((_, index) => <InputOTPSlot key={index} index={index} className="w-16 h-16 text-2xl font-mono font-bold
                           bg-gradient-to-b from-[hsl(var(--metal-dark))] via-[hsl(var(--metal-base))] to-[hsl(var(--metal-dark))]
                           border-2 border-[hsl(var(--rust-dark))] 
                           shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_0_1px_hsl(var(--steel-base)),0_4px_8px_rgba(0,0,0,0.6)]
                           text-[hsl(var(--amber-display))] 
                           data-[active=true]:border-[hsl(var(--amber-glow))] 
                           data-[active=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_0_2px_hsl(var(--amber-glow)),0_0_16px_hsl(var(--amber-glow)/0.4),0_4px_8px_rgba(0,0,0,0.6)]
                           data-[active=true]:animate-pulse
                           transition-all duration-300
                           relative overflow-hidden
                           before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-base)/0.1)] before:to-transparent
                           after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-[hsl(var(--steel-light)/0.3)]" />)}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Error Message - Industrial Warning */}
        {error && <div className="mb-6 p-4 bg-gradient-to-r from-[hsl(var(--rust-dark))] to-[hsl(var(--rust-base))] 
                            border-2 border-[hsl(var(--rust-light))] text-center
                            shadow-[0_0_16px_hsl(var(--rust-glow)/0.3)]
                            relative overflow-hidden
                            before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,hsl(var(--rust-glow)/0.1)_10px,hsl(var(--rust-glow)/0.1)_20px)]">
            <p className="text-[hsl(var(--amber-display))] font-mono font-bold uppercase tracking-wider text-sm
                         filter drop-shadow-[0_0_4px_hsl(var(--amber-glow)/0.8)]">
              ⚠ {error} ⚠
            </p>
          </div>}

        {/* Metallic Keypad */}
        <div className="mb-8">
          <MetallicKeypad onNumberClick={handleNumberClick} onBackspace={handleBackspace} onClear={handleClear} disabled={isLoading} />
        </div>

        {/* Submit Button - Heavy Duty Industrial Switch */}
        <Button onClick={handleSubmit} disabled={pin.length < 4 || isLoading} 
                className="w-full h-16 text-lg font-bold font-mono uppercase tracking-wider
                          bg-gradient-to-b from-[hsl(var(--rust-base))] via-[hsl(var(--rust-dark))] to-[hsl(var(--rust-base))]
                          border-4 border-[hsl(var(--metal-light))] 
                          text-[hsl(var(--amber-display))]
                          shadow-[0_4px_0_hsl(var(--metal-dark)),0_8px_16px_rgba(0,0,0,0.6),inset_0_2px_0_hsl(var(--rust-light)/0.2)]
                          hover:shadow-[0_2px_0_hsl(var(--metal-dark)),0_4px_12px_rgba(0,0,0,0.8),inset_0_2px_0_hsl(var(--rust-light)/0.2),0_0_20px_hsl(var(--amber-glow)/0.3)]
                          hover:translate-y-[2px] hover:border-[hsl(var(--amber-glow)/0.6)]
                          active:translate-y-[4px] active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                          transition-all duration-150
                          relative overflow-hidden
                          before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-light)/0.1)] before:to-transparent
                          after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-[hsl(var(--rust-light)/0.4)]">
          {isLoading ? <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-[hsl(var(--amber-glow))]" />
              <span className="animate-pulse">VERIFYING ACCESS...</span>
            </> : <><span className="text-2xl mr-2">🔓</span>UNLOCK ACCESS</>}
        </Button>

        <div className="mt-6 text-center text-xs text-[hsl(var(--steel-light))] font-mono uppercase tracking-widest
                     bg-[hsl(var(--metal-base)/0.2)] border border-[hsl(var(--rust-dark)/0.3)] py-2 px-4">
          <span className="text-[hsl(var(--rust-light))]">◤</span> KEYPAD OR PHYSICAL INPUT • 4-6 DIGITS <span className="text-[hsl(var(--rust-light))]">◥</span>
        </div>
      </div>
    </div>;
};
export default PinCodeOverlay;