import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Activity, Settings, FileText, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Agendamento {
  id: number;
  data: string;
  horario: string;
  status: string;
  servico_titulo?: string;
  cliente_nome?: string;
  pet_nome?: string;
}

interface Servico {
  id: number;
  titulo: string;
  descricao?: string;
  preco_cents: number;
  duration_min: number;
}

interface Stats {
  totalAgendamentos: number;
  agendamentosHoje: number;
  totalClientes: number;
  totalServicos: number;
}

const DashboardAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalAgendamentos: 0,
    agendamentosHoje: 0,
    totalClientes: 0,
    totalServicos: 0,
  });
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [isServicoDialogOpen, setIsServicoDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [servicoForm, setServicoForm] = useState({
    titulo: '',
    descricao: '',
    preco_cents: 0,
    duration_min: 30,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [agendamentosRes, servicosRes] = await Promise.all([
        api.get('/admin/agendamentos'),
        api.get('/servicos'),
      ]);

      const agendamentosData = agendamentosRes.data?.data ?? agendamentosRes.data ?? [];
      const servicosData = servicosRes.data?.data ?? servicosRes.data ?? [];

      setAgendamentos(Array.isArray(agendamentosData) ? agendamentosData : []);
      setServicos(Array.isArray(servicosData) ? servicosData : []);

      // Calcular estatísticas
      const hoje = new Date().toISOString().split('T')[0];
      const agendamentosHoje = agendamentosData.filter((a: Agendamento) => a.data === hoje).length;

      setStats({
        totalAgendamentos: agendamentosData.length,
        agendamentosHoje,
        totalClientes: new Set(agendamentosData.map((a: Agendamento) => a.cliente_nome)).size,
        totalServicos: servicosData.length,
      });
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      if (error?.response?.status === 401) {
        toast.error('Sessão expirada');
        navigate('/entrar');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenServicoDialog = (servico?: Servico) => {
    if (servico) {
      setEditingServico(servico);
      setServicoForm({
        titulo: servico.titulo,
        descricao: servico.descricao || '',
        preco_cents: servico.preco_cents,
        duration_min: servico.duration_min,
      });
    } else {
      setEditingServico(null);
      setServicoForm({
        titulo: '',
        descricao: '',
        preco_cents: 0,
        duration_min: 30,
      });
    }
    setIsServicoDialogOpen(true);
  };

  const handleSaveServico = async () => {
    try {
      if (editingServico) {
        await api.put(`/servicos/${editingServico.id}`, servicoForm);
        toast.success('Serviço atualizado com sucesso');
      } else {
        await api.post('/servicos', servicoForm);
        toast.success('Serviço criado com sucesso');
      }
      setIsServicoDialogOpen(false);
      loadDashboardData();
    } catch (error) {
      toast.error('Erro ao salvar serviço');
      console.error(error);
    }
  };

  const handleDeleteServico = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
      await api.delete(`/servicos/${id}`);
      toast.success('Serviço excluído com sucesso');
      loadDashboardData();
    } catch (error) {
      toast.error('Erro ao excluir serviço');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-health-gradient py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-primary-foreground/90">
            Bem-vindo, {user?.name}! Gerencie sua clínica de forma eficiente.
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Agendamentos
              </CardTitle>
              <Calendar className="w-4 h-4 text-health-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgendamentos}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Agendamentos Hoje
              </CardTitle>
              <Activity className="w-4 h-4 text-health-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.agendamentosHoje}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clientes
              </CardTitle>
              <Users className="w-4 h-4 text-health-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClientes}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Serviços Ativos
              </CardTitle>
              <FileText className="w-4 h-4 text-health-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServicos}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto max-w-7xl px-6 pb-8">
        <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => navigate('/calendario-vet')}
            className="h-20 text-lg bg-health-gradient"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Ver Calendário
          </Button>
          <Button 
            onClick={() => handleOpenServicoDialog()}
            variant="outline"
            className="h-20 text-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Serviço
          </Button>
          <Button 
            onClick={() => navigate('/perfil')}
            variant="outline"
            className="h-20 text-lg"
          >
            <Settings className="w-5 h-5 mr-2" />
            Configurações
          </Button>
        </div>
      </section>

      {/* Serviços Management */}
      <section className="container mx-auto max-w-7xl px-6 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Gestão de Serviços</h2>
          <Button onClick={() => handleOpenServicoDialog()}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Serviço
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.map((servico) => (
            <Card key={servico.id} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{servico.titulo}</CardTitle>
                <CardDescription>
                  {servico.descricao || 'Sem descrição'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Preço: <span className="font-semibold text-foreground">
                      R$ {(servico.preco_cents / 100).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duração: <span className="font-semibold text-foreground">
                      {servico.duration_min} min
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleOpenServicoDialog(servico)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteServico(servico.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Appointments */}
      <section className="container mx-auto max-w-7xl px-6 pb-12">
        <h2 className="text-2xl font-bold mb-4">Agendamentos Recentes</h2>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Horário</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Pet</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Serviço</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {agendamentos.slice(0, 10).map((agendamento) => (
                    <tr key={agendamento.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm">
                        {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm">{agendamento.horario}</td>
                      <td className="px-6 py-4 text-sm">{agendamento.cliente_nome}</td>
                      <td className="px-6 py-4 text-sm">{agendamento.pet_nome}</td>
                      <td className="px-6 py-4 text-sm">{agendamento.servico_titulo}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          agendamento.status === 'confirmado' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : agendamento.status === 'cancelado'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {agendamento.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Dialog para Criar/Editar Serviço */}
      <Dialog open={isServicoDialogOpen} onOpenChange={setIsServicoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do serviço abaixo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={servicoForm.titulo}
                onChange={(e) => setServicoForm({ ...servicoForm, titulo: e.target.value })}
                placeholder="Ex: Consulta Veterinária"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={servicoForm.descricao}
                onChange={(e) => setServicoForm({ ...servicoForm, descricao: e.target.value })}
                placeholder="Descrição do serviço"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={servicoForm.preco_cents / 100}
                  onChange={(e) => setServicoForm({ 
                    ...servicoForm, 
                    preco_cents: Math.round(parseFloat(e.target.value) * 100) 
                  })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (min)</Label>
                <Input
                  id="duracao"
                  type="number"
                  value={servicoForm.duration_min}
                  onChange={(e) => setServicoForm({ 
                    ...servicoForm, 
                    duration_min: parseInt(e.target.value) 
                  })}
                  placeholder="30"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServicoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveServico}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DashboardAdmin;
