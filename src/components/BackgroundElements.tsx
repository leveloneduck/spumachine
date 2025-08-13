import { motion } from 'framer-motion';

const BackgroundElements = () => {
  return (
    <>
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 -z-20 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
      </div>

      {/* Metallic Pillars */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Left Side Pillars */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-8 top-1/4 w-4 h-96 max-h-[60vh]"
          style={{
            background: `linear-gradient(90deg, 
              hsl(var(--muted-foreground)) 0%, 
              hsl(var(--accent)) 20%, 
              hsl(var(--muted-foreground)) 40%, 
              hsl(var(--accent)) 60%, 
              hsl(var(--muted-foreground)) 100%)`,
            boxShadow: `
              inset 2px 0 4px hsl(var(--accent) / 0.3),
              2px 0 8px hsl(var(--primary) / 0.2)
            `,
            borderRadius: '2px'
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute left-20 top-1/3 w-3 h-80 max-h-[50vh]"
          style={{
            background: `linear-gradient(90deg, 
              hsl(var(--muted-foreground)) 0%, 
              hsl(var(--accent)) 30%, 
              hsl(var(--muted-foreground)) 70%, 
              hsl(var(--accent)) 100%)`,
            boxShadow: `
              inset 1px 0 3px hsl(var(--accent) / 0.4),
              1px 0 6px hsl(var(--primary) / 0.3)
            `,
            borderRadius: '1px'
          }}
        />

        {/* Right Side Pillars */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute right-8 top-1/4 w-4 h-96 max-h-[60vh]"
          style={{
            background: `linear-gradient(90deg, 
              hsl(var(--muted-foreground)) 0%, 
              hsl(var(--accent)) 20%, 
              hsl(var(--muted-foreground)) 40%, 
              hsl(var(--accent)) 60%, 
              hsl(var(--muted-foreground)) 100%)`,
            boxShadow: `
              inset -2px 0 4px hsl(var(--accent) / 0.3),
              -2px 0 8px hsl(var(--primary) / 0.2)
            `,
            borderRadius: '2px'
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute right-20 top-1/3 w-3 h-80 max-h-[50vh]"
          style={{
            background: `linear-gradient(90deg, 
              hsl(var(--muted-foreground)) 0%, 
              hsl(var(--accent)) 30%, 
              hsl(var(--muted-foreground)) 70%, 
              hsl(var(--accent)) 100%)`,
            boxShadow: `
              inset -1px 0 3px hsl(var(--accent) / 0.4),
              -1px 0 6px hsl(var(--primary) / 0.3)
            `,
            borderRadius: '1px'
          }}
        />
      </div>

      {/* Enhanced Dynamic Glow */}
      <div className="absolute -z-10 left-1/2 top-1/3 h-[70vw] w-[70vw] max-h-[800px] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl animate-pulse" />
      <div className="absolute -z-10 left-1/2 top-1/3 h-[50vw] w-[50vw] max-h-[600px] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-2xl" />
    </>
  );
};

export default BackgroundElements;