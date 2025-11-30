import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MeusPets from './pages/meuspets';
import Serviços from './pages/serviços';
import NossaEquipe from './pages/nossaequipe';
import Entrar from './pages/Entrar';
import Registrar from "./pages/Registrar";
import EsqueciSenha from "./pages/EsqueciSenha";
import ResetarSenha from "./pages/ResetarSenha";
import CadastrarPet from "./pages/CadastroPet";
import Perfil from "./pages/Perfil";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Calendario from "./pages/Calendario";
import DashboardAdmin from "./pages/DashboardAdmin";
import CalendarioVet from "./pages/CalendarioVet";
import VerificarEmail from "./pages/VerificarEmail";
import VerificacaoPendente from "./pages/VerificacaoPendente";
import ReenviarVerificacao from "./pages/ReenviarVerificacao";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* MOVEMOS O CONTATO PARA CIMA! */}
            <Route path="/Entrar" element={<Entrar />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/verificacao-pendente" element={<VerificacaoPendente />} />
            <Route path="/verificar-email/:token" element={<VerificarEmail />} />
            <Route path="/reenviar-verificacao" element={<ReenviarVerificacao />} />
            <Route path="/serviços" element={<Serviços />} />
            <Route
              path="/meuspets"
              element={
                <PrivateRoute>
                  <MeusPets />
                </PrivateRoute>
              }
            />
            <Route 
              path="/cadastro-pet" 
              element={
                <PrivateRoute>
                  <CadastrarPet />
                </PrivateRoute>
              } 
            />
            {/* 2. ADICIONAR A NOVA ROTA (PROTEGIDA) */}
            <Route 
              path="/calendariovet" 
              element={
                <PrivateRoute>
                  <CalendarioVet />
                </PrivateRoute>
              } 
            />
            <Route path="/calendario" element={
              <PrivateRoute>
                <Calendario />
              </PrivateRoute>
            } />
            <Route path="/dashboardadmin" element={
              <PrivateRoute>
                <DashboardAdmin />
              </PrivateRoute>
            } />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/nossaequipe" element={<NossaEquipe />} />
            <Route path="/redefinir-senha/:token" element={<ResetarSenha />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;