import { Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react';

const NeonFooter = () => {
  return (
    <footer className="relative border-t border-[hsl(var(--rust-base)/0.3)] mt-0">
      {/* Metallic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--metal-dark))] via-[hsl(var(--metal-base))] to-[hsl(var(--metal-dark))]" />
      
      {/* Rust overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--rust-dark)/0.2)] via-transparent to-[hsl(var(--rust-base)/0.2)]" />
      
      <div className="container mx-auto py-2 flex flex-col md:flex-row items-center justify-between gap-2 relative z-10">
        <p className="text-sm text-[hsl(var(--metal-light))]">© {new Date().getFullYear()} 404 Limbots Collection</p>
        <div className="flex items-center gap-4">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[hsl(var(--metal-light))] hover:text-[hsl(var(--amber-glow))] hover-scale transition-colors duration-200" aria-label="Twitter">
            <Twitter size={18} />
          </a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-[hsl(var(--metal-light))] hover:text-[hsl(var(--amber-glow))] hover-scale transition-colors duration-200" aria-label="Discord">
            <MessageCircle size={18} />
          </a>
          <a href="#" className="text-[hsl(var(--metal-light))] hover:text-[hsl(var(--amber-glow))] hover-scale transition-colors duration-200" aria-label="Website">
            <LinkIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default NeonFooter;
