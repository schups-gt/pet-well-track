import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Corrigido para '@/contexts/AuthContext'
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/api'; // Importação da sua instância da API

export default function Perfil() {
  const { user, login } = useAuth(); // Adicionei 'login' para atualizar o contexto
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // NOVO: Estado de carregamento do botão
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    nome: user?.name || "",
    email: user?.email || "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    foto: ""
  });

  // NOVO: useEffect para carregar dados do perfil ao montar
  useEffect(() => {
    if (!user || !user.token) {
      setIsLoadingProfile(false);
      return;
    }

    const loadUserProfile = async () => {
      try {
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const userData = response.data.data;
        setFormData(prev => ({
          ...prev,
          nome: userData.name || prev.nome,
          email: userData.email || prev.email,
          telefone: userData.telefone || "",
          endereco: userData.endereco || "",
          cidade: userData.cidade || "",
          estado: userData.estado || "",
          cep: userData.cep || "",
        }));
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        // Se houver erro, manter os dados atuais
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validar se o usuário está logado
    if (!user || !user.token) {
        toast({
            title: "Erro de Autenticação",
            description: "Você precisa estar logado para salvar.",
            variant: "destructive",
        });
        return;
    }

    // 2. Coletar todos os campos para atualização
    const updateData = {
        name: formData.nome,
        telefone: formData.telefone,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
    };

    setIsLoading(true);

    try {
        // 3. Enviar a requisição PUT para /auth/user/profile
        const response = await api.put('/auth/user/profile', updateData, {
            headers: {
                Authorization: `Bearer ${user.token}`, // Envia o token para autenticação
            },
        });

        // 4. Se o Back-end retornar o objeto de usuário atualizado:
        const updatedUser = response.data.user;
        
        // Atualizar o formData com os dados retornados
        setFormData(prev => ({
          ...prev,
          nome: updatedUser.name || prev.nome,
          email: updatedUser.email || prev.email,
          telefone: updatedUser.telefone || prev.telefone,
          endereco: updatedUser.endereco || prev.endereco,
          cidade: updatedUser.cidade || prev.cidade,
          estado: updatedUser.estado || prev.estado,
          cep: updatedUser.cep || prev.cep,
        }));
        
        // NOVO: Atualiza o contexto global de autenticação com os novos dados
        // Isso fará com que o Header e o Perfil reflitam as mudanças instantaneamente.
        const currentToken = localStorage.getItem("token") || "";
        if (user) {
          login({ 
            id: user.id,
            name: updatedUser.name || user.name,
            email: user.email,
            role: user.role,
            owner_id: user.owner_id,
            telefone: updatedUser.telefone,
            endereco: updatedUser.endereco,
            cidade: updatedUser.cidade,
            estado: updatedUser.estado,
            cep: updatedUser.cep,
          }, currentToken);
        }

        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso.",
          variant: "default",
        });

    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível atualizar o perfil. Tente novamente.",
          variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const getInitials = () => {
    return formData.nome
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Se o usuário não estiver logado, redirecionar para o login
        if (!user) {
        const redirectTimeout = setTimeout(() => {
            navigate('/entrar');
            clearTimeout(redirectTimeout); // Clear the timeout
        }, 1000);

        return (
            <div className="flex justify-center items-center min-h-screen">
            <p>Redirecionando para o login...</p>
            </div>
        );
        }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-health-blue/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Meu Perfil</CardTitle>
            <CardDescription>
              Personalize suas informações e mantenha seu perfil atualizado
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Foto de Perfil */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32 border-4 border-health-pink/20">
                  <AvatarImage src={formData.foto} alt={formData.nome} />
                  <AvatarFallback className="bg-health-gradient text-white text-2xl">
                    {getInitials() || "US"}
                  </AvatarFallback>
                </Avatar>
                
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">Alterar foto</span>
                  </div>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </Label>
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Seu nome"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    required
                    disabled // Desabilitado no Front-end, pois a alteração de email requer steps de verificação
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Rua, número, complemento"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    placeholder="Sua cidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Botão de Salvar */}
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="hero" size="lg" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}