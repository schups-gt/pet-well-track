import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              <span className="text-xl font-bold">PetHealth+</span>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Revolucionando o cuidado com pets através de tecnologia avançada 
              e atendimento humanizado.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-background/10 text-background">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Links principais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Início</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Para Tutores</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Para Veterinários</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Preços</a></li>
            </ul>
          </div>
          
          {/* Suporte */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">FAQ</a></li>
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
                <Mail className="w-4 h-4 text-health-green" />
                <span className="text-background/80">contato@pethealth.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-health-blue" />
                <span className="text-background/80">(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-background/80">São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © 2024 PetHealth+. Todos os direitos reservados. 
            Desenvolvido com ❤️ para o bem-estar dos pets.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;