import { createContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  fotoDePerfil?: string;
}

interface AuthContextData {
  user: Usuario | null;
  signIn: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  atualizarDadosDoUsuario: (newUserData: Partial<Usuario>) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);



export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const recuperarUsuario = () => {
      const storedUser = localStorage.getItem("@PetWorking:user");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser.usuario);
          api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        } catch (error) {
          console.error("Erro ao recuperar usuário:", error);
          localStorage.removeItem("@PetWorking:user");
        }
      }
      
      setLoading(false);
    };

    recuperarUsuario();
  }, []);

  async function signIn(email: string, senha: string) {
    try {
      setLoading(true);
    
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const { token, usuario } = response.data;

      console.log("Usuario recebido:", usuario);
    
      localStorage.setItem(
        "@PetWorking:user", 
        JSON.stringify({ token, usuario })
      );
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(usuario);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

const atualizarDadosDoUsuario = (newUserData: Partial<Usuario>) => {
  const storedUser = localStorage.getItem("@PetWorking:user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    const updatedUser = {
      ...parsedUser,
      usuario: { ...parsedUser.usuario, ...newUserData }
    };
    localStorage.setItem("@PetWorking:user", JSON.stringify(updatedUser));
    setUser(prevUser => prevUser ? ({ ...prevUser, ...newUserData } as Usuario) : null);
  }
};

  function logout() {
    localStorage.removeItem("@PetWorking:user");
    api.defaults.headers.common['Authorization'] = "";
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        logout,
        isAuthenticated: !!user,
        loading,
        atualizarDadosDoUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}