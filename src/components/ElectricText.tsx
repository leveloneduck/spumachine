import { motion } from 'framer-motion';

interface ElectricTextProps {
  text: string;
  className?: string;
}

const ElectricText = ({ 
  text, 
  className = ""
}: ElectricTextProps) => {
  return (
    <div className="relative inline-block">
      <motion.h1
        className={`relative z-10 ${className}`}
        animate={{
          textShadow: [
            "0 0 30px hsl(var(--amber-glow)), 0 0 50px hsl(var(--amber-glow)), 0 0 70px hsl(var(--amber-glow)), 0 0 90px hsl(var(--amber-glow))",
            "0 0 35px hsl(var(--amber-glow)), 0 0 55px hsl(var(--amber-glow)), 0 0 75px hsl(var(--amber-glow)), 0 0 95px hsl(var(--amber-glow))",
            "0 0 30px hsl(var(--amber-glow)), 0 0 50px hsl(var(--amber-glow)), 0 0 70px hsl(var(--amber-glow)), 0 0 90px hsl(var(--amber-glow))"
          ],
          filter: [
            "brightness(0.8) saturate(1.1)",
            "brightness(0.9) saturate(1.2)",
            "brightness(0.8) saturate(1.1)"
          ]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          willChange: 'filter, text-shadow',
          transform: 'translateZ(0)', // GPU acceleration
        }}
      >
        {text}
      </motion.h1>
    </div>
  );
};

export default ElectricText;