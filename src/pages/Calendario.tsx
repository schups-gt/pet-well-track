import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, User, PawPrint, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Agendamento {
  id: number;
  owner_id: number;
  cliente_id: number;
  servico_id: number;
  data_hora: string;
  status?: string;
  observacoes?: string;
  servico_titulo?: string;
  duration_min?: number;
}

export default function Calendario() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && user) {
      fetchAgendamentos();
    }
  }, [selectedDate, user]);

  const fetchAgendamentos = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const dateISO = format(selectedDate, "yyyy-MM-dd");
      
      // Busca agendamentos do dia selecionado
      const response = await axios.get(
        `http://localhost:3000/agendamentos`,
        {
          params: {
            from: `${dateISO}T00:00:00.000Z`,
            to: `${dateISO}T23:59:59.999Z`,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgendamentos(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-500";
      case "cancelado":
        return "bg-red-500";
      case "pendente":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "cancelado":
        return "Cancelado";
      case "pendente":
        return "Pendente";
      default:
        return "Agendado";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Calendário de Agendamentos
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie seus agendamentos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Selecione uma Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className={cn("rounded-md border pointer-events-auto")}
              />
            </CardContent>
          </Card>

          {/* Lista de Agendamentos */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Agendamentos - {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardTitle>
              <CardDescription>
                {loading ? "Carregando..." : `${agendamentos.length} agendamento(s) encontrado(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando agendamentos...
                </div>
              ) : agendamentos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento para esta data
                </div>
              ) : (
                <div className="space-y-4">
                  {agendamentos
                    .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
                    .map((agendamento) => (
                      <Card
                        key={agendamento.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedAgendamento(agendamento)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">
                                  {format(new Date(agendamento.data_hora), "HH:mm")}
                                </span>
                                <Badge className={getStatusColor(agendamento.status)}>
                                  {getStatusLabel(agendamento.status)}
                                </Badge>
                              </div>
                              
                              {agendamento.servico_titulo && (
                                <div className="flex items-center gap-2 text-sm">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>{agendamento.servico_titulo}</span>
                                </div>
                              )}

                              {agendamento.duration_min && (
                                <div className="text-sm text-muted-foreground">
                                  Duração: {agendamento.duration_min} minutos
                                </div>
                              )}
                            </div>
                            
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedAgendamento} onOpenChange={() => setSelectedAgendamento(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              Informações completas sobre o agendamento
            </DialogDescription>
          </DialogHeader>
          
          {selectedAgendamento && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Data e Hora</span>
                </div>
                <p className="text-sm">
                  {format(new Date(selectedAgendamento.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Serviço</span>
                </div>
                <p className="text-sm">
                  {selectedAgendamento.servico_titulo || "Não especificado"}
                </p>
              </div>

              {selectedAgendamento.duration_min && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Duração</span>
                    </div>
                    <p className="text-sm">{selectedAgendamento.duration_min} minutos</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <span className="text-sm font-medium">Status</span>
                <div>
                  <Badge className={getStatusColor(selectedAgendamento.status)}>
                    {getStatusLabel(selectedAgendamento.status)}
                  </Badge>
                </div>
              </div>

              {selectedAgendamento.observacoes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Observações</span>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgendamento.observacoes}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
