import { Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react';

const NeonFooter = () => {
  return (
    <footer className="border-t mt-0">
      <div className="container mx-auto py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} 404 Cyberpunk Collection</p>
        <div className="flex items-center gap-4">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground hover-scale" aria-label="Twitter">
            <Twitter size={18} />
          </a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground hover-scale" aria-label="Discord">
            <MessageCircle size={18} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground hover-scale" aria-label="Website">
            <LinkIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default NeonFooter;
