import { useState, useEffect } from 'react';

export const useBrowserFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>('');

  useEffect(() => {
    const generateFingerprint = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
      }
      
      const canvasFingerprint = canvas.toDataURL();
      
      const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.platform,
        navigator.cookieEnabled,
        navigator.doNotTrack,
        canvasFingerprint.substring(0, 100), // Truncate canvas data
      ];
      
      // Simple hash function
      let hash = 0;
      const str = components.join('|');
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return Math.abs(hash).toString(36);
    };

    setFingerprint(generateFingerprint());
  }, []);

  return fingerprint;
};