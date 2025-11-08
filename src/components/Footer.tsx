import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'


const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo e descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-health-gradient rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Dsk.Vet</span>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Nos siga no instagram para ficar por dentro das últimas novidades e dicas sobre 
              cuidados com pets.
            </p>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background">
                    <Instagram className="w-5 h-5" />
                  </Button>
                </a>
              </div>
          </div>
          
          {/* Links principais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-background/80 hover:text-background transition-colors">Início</Link></li>
              <li><Link to="/serviços" className="text-background/80 hover:text-background transition-colors">Serviços</Link></li>
              <li><Link to="/meuspets" className="text-background/80 hover:text-background transition-colors">Meus Pets</Link></li>
              <li><Link to="/perfil" className="text-background/80 hover:text-background transition-colors">Perfil</Link></li>
              <li><Link to="/contato" className="text-background/80 hover:text-background transition-colors">Contato</Link></li>
              <li><Link to="/nossaequipe" className="text-background/80 hover:text-background transition-colors">Nossa Equipe</Link></li>
            </ul>
          </div>
          
          {/* Suporte */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Perguntas Frequentes</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Contato</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
          
          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-health-pink" />
                <span className="text-background/80">contato@Dskvet.com.br</span>
              </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-health-blue" />
                  <a 
                    href="https://api.whatsapp.com/message/AVTEDMWEANQFE1?autoload=1&app_absent=0" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-background/80 hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-background/80">Ribeirão Preto, SP</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © 2025 Dsk.Vet. Todos os direitos reservados. 
            Desenvolvido com AMOR para o bem-estar dos pets.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;