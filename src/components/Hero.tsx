import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-pet-health.jpg';
import { ArrowRight, Play } from 'lucide-react';
import Carrossel from './carrossel';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-health-gradient-soft opacity-20" />
      
      <div className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Acompanhe a saúde do seu{' '}
              <span className="text-transparent bg-clip-text bg-health-gradient">
                pet em tempo real
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Conecte-se com a veterinária especializada e monitore o bem-estar do seu 
              companheiro com cuidado personalizado.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/entrar">
              <Button variant="hero" size="lg" className="group">
                Acessar Plataforma
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <a
              href="https://www.instagram.com/dks.vet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="group">
                <Play className="w-5 h-5 mr-2" />
                Ver demonstração
              </Button>
            </a>
          </div>
          
          <div className="flex items-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-health-pink">50+</div>
              <div className="text-sm text-muted-foreground">Pets monitorados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-health-blue">200+</div>
              <div className="text-sm text-muted-foreground">Tutores satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10+</div>
              <div className="text-sm text-muted-foreground">Anos de Experiência</div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-card">
            <Carrossel />
          </div>
          
          
          <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-card border border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-health-blue">24/7</div>
              <div className="text-xs text-muted-foreground">Monitoramento</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;