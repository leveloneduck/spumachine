import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

interface SocialMediaButtonsProps {
  links?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
  };
}

export const SocialMediaButtons = ({ links = {} }: SocialMediaButtonsProps) => {
  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: links.instagram || '#',
      ariaLabel: 'Follow us on Instagram'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: links.youtube || '#',
      ariaLabel: 'Subscribe to our YouTube channel'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: links.facebook || '#',
      ariaLabel: 'Like us on Facebook'
    },
    {
      name: 'X',
      icon: Twitter,
      url: links.twitter || '#',
      ariaLabel: 'Follow us on X (Twitter)'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
      className="flex justify-center mb-6"
    >
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {socialPlatforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              ease: 'easeOut', 
              delay: 0.3 + (index * 0.1) 
            }}
          >
            <Button
              variant="mechanical"
              size="icon"
              asChild
              className="h-10 w-10 md:h-12 md:w-12 hover-scale 
                         shadow-[0_0_12px_hsl(var(--primary)/0.3)] 
                         border-[hsl(var(--rust-base)/0.4)] 
                         bg-gradient-to-b from-[hsl(var(--metal-base)/0.8)] to-[hsl(var(--metal-dark)/0.6)] 
                         backdrop-blur-sm
                         hover:shadow-[0_0_16px_hsl(var(--primary)/0.4)] 
                         hover:border-[hsl(var(--rust-base)/0.6)]
                         transition-all duration-200"
            >
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform.ariaLabel}
                className="flex items-center justify-center"
              >
                <platform.icon 
                  size={18} 
                  className="text-[hsl(var(--amber-display))] hover:text-[hsl(var(--amber-glow))] transition-colors duration-200" 
                />
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};