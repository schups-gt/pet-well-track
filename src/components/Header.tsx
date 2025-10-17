import { Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
// 1. IMPORTAÇÃO ESSENCIAL: Adicionamos o 'Link' do React Router
import { Link } from 'react-router-dom';

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
          {/* 2. CORREÇÃO: Usamos Link to="/" em vez de a href="#" */}
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Início
          </Link>
          {/* Outros links corrigidos, mas ainda sem rota definida */}
          <Link to="/serviços" className="text-muted-foreground hover:text-foreground transition-colors">
            Serviços
          </Link>
          <Link to="/meuspets" className="text-muted-foreground hover:text-foreground transition-colors">
            Meus Pets
          </Link>
          <Link to="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </Link>
          <Link to="/nossaequipe" className="text-muted-foreground hover:text-foreground transition-colors">
            Nossa Equipe
          </Link>
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
