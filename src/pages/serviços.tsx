import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Stethoscope, Zap, Magnet, Droplet, Activity, Leaf, Pill, HandMetal, Waves, Sparkles } from 'lucide-react';

const Serviços = () => {
  const servicos = [
    {
      icon: Stethoscope,
      title: "Cinesioterapia",
      description: "Terapia por movimento para reabilitação muscular e articular, promovendo recuperação e fortalecimento.",
      color: "text-health-pink"
    },
    {
      icon: Zap,
      title: "Fotobiomodulação com Laser",
      description: "Tratamento com laser de baixa intensidade para acelerar cicatrização e reduzir inflamações.",
      color: "text-health-blue"
    },
    {
      icon: Magnet,
      title: "Magnetoterapia",
      description: "Terapia com campo magnético para estimular regeneração celular e alívio de dores.",
      color: "text-health-pink"
    },
    {
      icon: Droplet,
      title: "Ozonioterapia",
      description: "Aplicação de ozônio medicinal para oxigenação e fortalecimento do sistema imunológico.",
      color: "text-health-blue"
    },
    {
      icon: Activity,
      title: "Moxabustão",
      description: "Técnica da medicina tradicional chinesa com calor para estimular pontos energéticos.",
      color: "text-health-pink"
    },
    {
      icon: Leaf,
      title: "Dietoterapia",
      description: "Orientação nutricional personalizada para suporte ao tratamento e qualidade de vida.",
      color: "text-health-blue"
    },
    {
      icon: Sparkles,
      title: "Acupuntura",
      description: "Técnica milenar para equilíbrio energético e alívio de dores através de pontos específicos.",
      color: "text-health-pink"
    },
    {
      icon: Waves,
      title: "Eletroterapia",
      description: "Uso de correntes elétricas terapêuticas para estimulação muscular e controle da dor.",
      color: "text-health-blue"
    },
    {
      icon: HandMetal,
      title: "Terapia Manual",
      description: "Técnicas manuais especializadas para mobilização articular e relaxamento muscular.",
      color: "text-health-pink"
    },
    {
      icon: Leaf,
      title: "Fitoterapia",
      description: "Uso de plantas medicinais como suporte terapêutico natural e complementar.",
      color: "text-health-blue"
    },
    {
      icon: Pill,
      title: "Terapia Medicamentosa",
      description: "Prescrição e acompanhamento farmacológico personalizado para cada caso.",
      color: "text-health-pink"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-health-gradient py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-primary-foreground animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Cuidado Especializado para Seu Pet
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Nossa abordagem começa com uma avaliação completa do seu pet, onde verificamos atrofia muscular, 
            sensibilidade à dor, reflexos neurológicos e condições ortopédicas. A partir dessa análise detalhada, 
            desenvolvemos um protocolo de tratamento personalizado e exclusivo para as necessidades específicas 
            de cada animal.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Tratamentos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada protocolo é único e pode incluir uma combinação dos seguintes tratamentos, 
              sempre adaptado ao caso específico do seu pet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map((servico, index) => {
              const Icon = servico.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-border/50"
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-health-gradient-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${servico.color}`} />
                    </div>
                    <CardTitle className="text-xl">{servico.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {servico.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para Cuidar do Seu Pet?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Entre em contato conosco para agendar uma avaliação completa e iniciar o tratamento 
            personalizado que seu pet merece
          </p>
          <a 
            href="/contato" 
            className="inline-block bg-health-gradient text-primary-foreground font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-soft"
          >
            Agendar Avaliação
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Serviços;
