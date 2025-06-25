import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface RotaPrivadaProps {
  children: React.ReactNode;
}

export const RotaPrivada = ({ children }: RotaPrivadaProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de loading
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
