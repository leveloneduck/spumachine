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
            "0 0 20px hsl(var(--amber-glow)), 0 0 30px hsl(var(--amber-glow)), 0 0 40px #00BFFF",
            "0 0 25px hsl(var(--amber-glow)), 0 0 35px hsl(var(--amber-glow)), 0 0 45px #00FFFF",
            "0 0 20px hsl(var(--amber-glow)), 0 0 30px hsl(var(--amber-glow)), 0 0 40px #00BFFF"
          ],
          filter: [
            "brightness(1.1) saturate(1.2)",
            "brightness(1.2) saturate(1.3)",
            "brightness(1.1) saturate(1.2)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          willChange: 'filter, text-shadow'
        }}
      >
        {text}
      </motion.h1>
    </div>
  );
};

export default ElectricText;