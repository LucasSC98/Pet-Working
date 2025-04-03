import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos";
import MeusPets from "./pages/MeusPets";
import MinhaConta from "./pages/MinhaConta";
import Servicos from "./pages/Servicos";
import { AuthProvider } from "./context/AuthContext";
import Configuracoes from "./pages/Configuracoes";
import PaginaNaoEncontrada from "./pages/PaginaNãoEncontrada";
import { ErrorProvider } from "./contexts/ErrorContext";
import { GlobalErros } from "./components/GlobalErros";
import NovoAgendamento from "./pages/NovoAgendamento";

const BodyClassHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace("/", "");
    document.body.className = path || "login";

    return () => {
      document.body.className = "";
    };
  }, [location]);

  return null;
};

function AppContent() {
  return (
    <>
      <BodyClassHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/pets" element={<MeusPets />} />
        <Route path="/minha-conta" element={<MinhaConta />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/*" element={<PaginaNaoEncontrada />} />
        <Route
          path="/novo-agendamento"
          element={
            <NovoAgendamento
              onClose={function (): void {
                throw new Error("Ainda não implementado");
              }}
              isOpen={false}
            />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorProvider>
          <GlobalErros />
          <AppContent />
        </ErrorProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
