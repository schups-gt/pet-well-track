import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Stethoscope, 
  Monitor, 
  FileText, 
  Bell, 
  BarChart3 
} from 'lucide-react';

const UserTypes = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Soluções para cada necessidade
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos interfaces especializadas tanto para tutores quanto para 
            profissionais veterinários.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Tutores */}
          <Card className="p-8 shadow-card border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-health-gradient-soft rounded-full -translate-y-16 translate-x-16 opacity-20" />
            
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-health-gradient rounded-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Para Tutores</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    Cuidado personalizado
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-health-pink mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Dashboard Intuitivo</h4>
                    <p className="text-muted-foreground text-sm">
                      Visualize a evolução da saúde do seu pet com gráficos e métricas fáceis de entender.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-health-blue mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Histórico Completo</h4>
                    <p className="text-muted-foreground text-sm">
                      Acesse exames, consultas e agendamentos organizados cronologicamente.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Alertas Personalizados</h4>
                    <p className="text-muted-foreground text-sm">
                      Receba feedbacks sobre medicamentos, consultas e cuidados especiais.
                    </p>
                  </div>
                </div>
              </div>
              
            </CardContent>
          </Card>
          
          {/* Veterinários */}
          <Card className="p-8 shadow-card border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-health-gradient-soft rounded-full -translate-y-16 translate-x-16 opacity-20" />
            
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-health-gradient rounded-lg">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Para Veterinários</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    Gestão profissional
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-health-pink mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Painel de Gestão</h4>
                    <p className="text-muted-foreground text-sm">
                      Gerencie múltiplos pacientes com interface profissional e eficiente.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-health-blue mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Monitoramento Avançado</h4>
                    <p className="text-muted-foreground text-sm">
                      Acompanhe sinais vitais e receba alertas sobre alterações críticas.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Prontuário Digital</h4>
                    <p className="text-muted-foreground text-sm">
                      Atualize informações médicas e prescrições de forma rápida e segura.
                    </p>
                  </div>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserTypes;