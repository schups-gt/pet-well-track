import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface VetRouteProps {
  children: React.ReactNode;
}

const VetRoute = ({ children }: VetRouteProps) => {
  const { user } = useAuth();

  // Se não estiver logado, redireciona para login
  if (!user) {
    return <Navigate to="/entrar" replace />;
  }

  // Se não for veterinário ou admin, redireciona para home
  if (user.role !== "vet" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default VetRoute;
