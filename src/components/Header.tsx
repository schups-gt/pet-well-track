import { Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-health-gradient rounded-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">PetHealth+</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Início
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Funcionalidades
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Para Tutores
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Para Veterinários
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:inline-flex">
            Entrar
          </Button>
          <Button variant="hero">
            Acessar Plataforma
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;