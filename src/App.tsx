import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contato from './pages/Contato';
import MeusPets from './pages/MeusPets';
import Serviços from './pages/serviços';
import NossaEquipe from './pages/NossaEquipe';
import Entrar from './pages/Entrar';
import Registrar from "./pages/Registrar";
import EsqueciSenha from "./pages/EsqueciSenha";
import ResetarSenha from "./pages/ResetarSenha";
import CadastrarPet from "./pages/CadastroPet";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* MOVEMOS O CONTATO PARA CIMA! */}
          <Route path="/" element={<Entrar />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/serviços" element={<Serviços />} />
          <Route path="/meuspets" element={<MeusPets />} />
          <Route path="/cadastro-pet" element={<CadastrarPet />} />
          <Route path="/nossaequipe" element={<NossaEquipe />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/redefinir-senha/:token" element={<ResetarSenha />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;