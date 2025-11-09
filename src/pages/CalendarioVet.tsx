import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, User, PawPrint, FileText, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
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

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
}

interface Pet {
  id: number;
  nome: string;
  especie?: string;
  raca?: string;
}

export default function CalendarioVet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editObservacoes, setEditObservacoes] = useState<string>("");

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
      
      const response = await axios.get(
        `http://localhost:3000/api/agendamentos`,
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
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos",
        variant: "destructive",
      });
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAgendamento = async () => {
    if (!selectedAgendamento) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/agendamentos/${selectedAgendamento.id}`,
        {
          status: editStatus,
          observacoes: editObservacoes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Sucesso",
        description: "Agendamento atualizado com sucesso",
      });

      setEditMode(false);
      setSelectedAgendamento(null);
      fetchAgendamentos();
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o agendamento",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAgendamento = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/agendamentos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso",
      });

      setSelectedAgendamento(null);
      fetchAgendamentos();
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o agendamento",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAgendamento = async (agendamento: Agendamento) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/agendamentos/${agendamento.id}`,
        {
          status: "confirmado",
          observacoes: agendamento.observacoes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Sucesso",
        description: "Agendamento confirmado",
      });

      fetchAgendamentos();
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível confirmar o agendamento",
        variant: "destructive",
      });
    }
  };

  const handleCancelAgendamento = async (agendamento: Agendamento) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/agendamentos/${agendamento.id}`,
        {
          status: "cancelado",
          observacoes: agendamento.observacoes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Sucesso",
        description: "Agendamento cancelado",
      });

      fetchAgendamentos();
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar o agendamento",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setEditStatus(agendamento.status || "pendente");
    setEditObservacoes(agendamento.observacoes || "");
    setEditMode(true);
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

  const getStatusStats = () => {
    const total = agendamentos.length;
    const confirmados = agendamentos.filter(a => a.status === "confirmado").length;
    const pendentes = agendamentos.filter(a => a.status === "pendente" || !a.status).length;
    const cancelados = agendamentos.filter(a => a.status === "cancelado").length;
    
    return { total, confirmados, pendentes, cancelados };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Calendário Veterinário
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos e horários
          </p>
        </div>

        {/* Estatísticas do Dia */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmados}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cancelados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelados}</div>
            </CardContent>
          </Card>
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
                {loading ? "Carregando..." : `${agendamentos.length} agendamento(s)`}
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
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
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

                                {agendamento.observacoes && (
                                  <div className="text-sm text-muted-foreground">
                                    {agendamento.observacoes}
                                  </div>
                                )}
                              </div>
                            </div>

                            <Separator />

                            {/* Ações Rápidas */}
                            <div className="flex gap-2 flex-wrap">
                              {agendamento.status !== "confirmado" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleConfirmAgendamento(agendamento)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirmar
                                </Button>
                              )}
                              
                              {agendamento.status !== "cancelado" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleCancelAgendamento(agendamento)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancelar
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(agendamento)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteAgendamento(agendamento.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Excluir
                              </Button>
                            </div>
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

      {/* Dialog de Edição */}
      <Dialog open={editMode} onOpenChange={(open) => {
        if (!open) {
          setEditMode(false);
          setSelectedAgendamento(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>
              Atualize as informações do agendamento
            </DialogDescription>
          </DialogHeader>
          
          {selectedAgendamento && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  {format(new Date(selectedAgendamento.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
                {selectedAgendamento.servico_titulo && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {selectedAgendamento.servico_titulo}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Adicione observações sobre o agendamento..."
                  value={editObservacoes}
                  onChange={(e) => setEditObservacoes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateAgendamento}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
