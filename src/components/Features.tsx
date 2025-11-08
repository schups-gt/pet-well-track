import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Calendar, 
  MessageCircle, 
  Shield, 
  Smartphone, 
  Users 
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: "Monitoramento em Tempo Real",
    description: "Acompanhe os sinais vitais e atividades do seu pet 24 horas por dia.",
    color: "text-health-pink"
  },
  {
    icon: Calendar,
    title: "Histórico Completo",
    description: "Tenha acesso ao histórico médico completo, exames e consultas organizados em um só lugar.",
    color: "text-health-blue"
  },
  {
    icon: MessageCircle,
    title: "Comunicação Direta",
    description: "Converse diretamente com a veterinária através da pagina 'contato' e receba orientações especializadas.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "DEFINIR FUNCIONALIDADE",
    description: "PLACE HOLDER",
    color: "text-accent"
  },
  {
    icon: Smartphone,
    title: "Site Versátil",
    description: "Acesse todas as funcionalidades e informações através de nossas abas de navegação.",
    color: "text-health-pink"
  },
  {
    icon: Users,
    title: "Atendimento em Casa",
    description: "Nossa veterinária especializada está pronta para cuidar do seu pet em casa.",
    color: "text-health-blue"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Funcionalidades que fazem a diferença
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra como nossa plataforma revoluciona o cuidado com pets através 
            de atendimento humanizado.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-health-gradient-soft rounded-lg">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;