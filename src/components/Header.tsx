import { Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
// 1. IMPORTAÇÃO ESSENCIAL: Adicionamos o 'Link' do React Router
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10">
            <img 
              src={logo} // usa a variável importada
              alt="Dsk.Vet"
              className="w-10 h-10 object-contain"
            />
          </div>
          <span className="text-xl font-bold text-foreground">Dsk.Vet</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
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
          <Link to="/perfil" className="text-muted-foreground hover:text-foreground transition-colors">
            Perfil
          </Link>
          <Link to="/nossaequipe" className="text-muted-foreground hover:text-foreground transition-colors">
            Nossa Equipe
          </Link>
          {user && (
            <Link to="/calendario" className="text-muted-foreground hover:text-foreground transition-colors">
              Meu Calendário
            </Link>
          )}
          {user && (user.role === "vet" || user.role === "admin") && (
            <>
              <Link to="/dashboard-admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/calendario-vet" className="text-muted-foreground hover:text-foreground transition-colors">
                Calendário Vet
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden md:inline-flex">Olá, {user.name}</span>
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/entrar" className="hidden md:inline-flex">
                Entrar
              </Link>
              <Link to="/registrar" className="hidden md:inline-flex">
                <Button variant="hero">Criar conta</Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
