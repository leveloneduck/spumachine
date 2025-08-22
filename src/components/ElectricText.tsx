import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ElectricTextProps {
  text: string;
  className?: string;
  zapInterval?: number;
  intensity?: 'low' | 'medium' | 'high';
}

const ElectricText = ({ 
  text, 
  className = "", 
  zapInterval = 5000,
  intensity = 'high' 
}: ElectricTextProps) => {
  const [isZapping, setIsZapping] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const triggerZap = useCallback(() => {
    setIsZapping(true);
    
    // Generate spark particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.3
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setIsZapping(false);
      setParticles([]);
    }, 1500);
  }, []);

  useEffect(() => {
    const randomInterval = () => {
      const variance = zapInterval * 0.4;
      return zapInterval + (Math.random() - 0.5) * variance;
    };

    const scheduleNextZap = () => {
      setTimeout(() => {
        triggerZap();
        scheduleNextZap();
      }, randomInterval());
    };

    const initialDelay = setTimeout(() => {
      triggerZap();
      scheduleNextZap();
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, [zapInterval, triggerZap]);

  const lightningPaths = [
    "M10,50 L25,20 L40,60 L55,10 L70,45 L85,15 L100,50",
    "M0,40 L20,70 L35,25 L50,65 L65,30 L80,55 L95,35",
    "M15,60 L30,25 L45,70 L60,20 L75,50 L90,25"
  ];

  return (
    <div className="relative inline-block">
      {/* Base text with electric glow */}
      <motion.h1
        className={`relative z-10 ${className}`}
        animate={isZapping ? {
          textShadow: [
            "0 0 10px hsl(var(--amber-glow)), 0 0 20px hsl(var(--amber-glow)), 0 0 30px #00BFFF, 0 0 40px #00BFFF",
            "0 0 15px hsl(var(--amber-glow)), 0 0 25px hsl(var(--amber-glow)), 0 0 35px #00FFFF, 0 0 45px #00FFFF",
            "0 0 10px hsl(var(--amber-glow)), 0 0 20px hsl(var(--amber-glow)), 0 0 30px #00BFFF, 0 0 40px #00BFFF"
          ],
          opacity: [1, 0.9, 1, 0.95, 1],
          filter: [
            "brightness(1) saturate(1)",
            "brightness(1.3) saturate(1.5)",
            "brightness(1.1) saturate(1.2)",
            "brightness(1.2) saturate(1.4)",
            "brightness(1) saturate(1)"
          ]
        } : {
          textShadow: "0 0 30px hsl(var(--amber-glow)/0.5)",
          opacity: 1,
          filter: "brightness(1) saturate(1)"
        }}
        transition={{
          duration: isZapping ? 0.8 : 2,
          ease: "easeInOut",
          times: isZapping ? [0, 0.2, 0.4, 0.7, 1] : undefined
        }}
        style={{
          willChange: 'filter, text-shadow, opacity'
        }}
      >
        {text}
      </motion.h1>

      {/* Lightning bolts overlay */}
      {isZapping && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {lightningPaths.map((path, index) => (
              <motion.path
                key={index}
                d={path}
                fill="none"
                stroke={index % 2 === 0 ? "#00BFFF" : "#00FFFF"}
                strokeWidth="0.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ 
                  pathLength: 0, 
                  opacity: 0,
                  filter: "drop-shadow(0 0 2px currentColor)"
                }}
                animate={{ 
                  pathLength: [0, 1, 0], 
                  opacity: [0, 1, 0.7, 0],
                  strokeWidth: [0.3, 0.8, 0.4, 0.1]
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        </div>
      )}

      {/* Electric particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: "0 0 4px #00FFFF, 0 0 8px #00BFFF"
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{ 
            opacity: [0, 1, 0.8, 0], 
            scale: [0, 1.5, 1, 0],
            x: [0, (Math.random() - 0.5) * 20],
            y: [0, (Math.random() - 0.5) * 20]
          }}
          transition={{
            duration: 1,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Ambient electric field effect */}
      {isZapping && (
        <motion.div
          className="absolute inset-0 pointer-events-none -z-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0.1, 0.2, 0],
            background: [
              "radial-gradient(ellipse at center, transparent 40%, #00BFFF10 60%, transparent 80%)",
              "radial-gradient(ellipse at center, transparent 30%, #00FFFF15 50%, transparent 70%)",
              "radial-gradient(ellipse at center, transparent 40%, #00BFFF10 60%, transparent 80%)"
            ]
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

export default ElectricText;