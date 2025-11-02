import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedPage from "../pages/ProtectedPage";

interface PrivateRouteProps {
  children: JSX.Element;
}
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <ProtectedPage />;
};


export default PrivateRoute;