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
/* import { ErrorProvider } from "./contexts/ErrorContext";
import { GlobalErros } from "./components/GlobalErros"; */
import NovoAgendamento from "./pages/NovoAgendamento";
import { RotaPrivada } from "./components/RotaPrivada";
import DetalhesAgendamento from "./pages/DetalhesAgendamento";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import Loja from "./pages/Loja";
import DetalhesProduto from "./pages/DetalhesProduto";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import ConfirmacaoPedido from "./pages/ConfirmacaoPedido";
import MeusPedidos from "./pages/MeusPedidos";

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
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <RotaPrivada>
              <Dashboard />
            </RotaPrivada>
          }
        />
        <Route
          path="/agendamentos"
          element={
            <RotaPrivada>
              <Agendamentos />
            </RotaPrivada>
          }
        />
        <Route
          path="/agendamentos/:id"
          element={
            <RotaPrivada>
              <DetalhesAgendamento />
            </RotaPrivada>
          }
        />
        <Route
          path="/pets"
          element={
            <RotaPrivada>
              <MeusPets />
            </RotaPrivada>
          }
        />

        {/* Rotas da Loja */}
        <Route
          path="/loja"
          element={
            <RotaPrivada>
              <Loja />
            </RotaPrivada>
          }
        />
        <Route
          path="/loja/produto/:id"
          element={
            <RotaPrivada>
              <DetalhesProduto />
            </RotaPrivada>
          }
        />
        <Route
          path="/loja/carrinho"
          element={
            <RotaPrivada>
              <Carrinho />
            </RotaPrivada>
          }
        />
        <Route
          path="/loja/checkout"
          element={
            <RotaPrivada>
              <Checkout />
            </RotaPrivada>
          }
        />
        <Route
          path="/loja/confirmacao"
          element={
            <RotaPrivada>
              <ConfirmacaoPedido />
            </RotaPrivada>
          }
        />
        <Route
          path="/loja/meus-pedidos"
          element={
            <RotaPrivada>
              <MeusPedidos />
            </RotaPrivada>
          }
        />

        <Route
          path="/minha-conta"
          element={
            <RotaPrivada>
              <MinhaConta />
            </RotaPrivada>
          }
        />
        <Route
          path="/servicos"
          element={
            <RotaPrivada>
              <Servicos />
            </RotaPrivada>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <RotaPrivada>
              <Configuracoes />
            </RotaPrivada>
          }
        />
        <Route
          path="/novo-agendamento"
          element={
            <RotaPrivada>
              <NovoAgendamento onClose={() => {}} isOpen={false} />
            </RotaPrivada>
          }
        />
        <Route path="/*" element={<PaginaNaoEncontrada />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CarrinhoProvider>
          {/*         <ErrorProvider>
          <GlobalErros /> */}
          <AppContent />
          {/*         </ErrorProvider> */}
        </CarrinhoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
