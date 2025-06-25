import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/ConfirmacaoPedido.css";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

interface LocationState {
  pedidoId?: number;
}

const ConfirmacaoPedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state || !state.pedidoId) {
      navigate("/loja");
    }
  }, [state, navigate]);

  if (!state || !state.pedidoId) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="confirmacao-container">
        <div className="confirmacao-card">
          <div className="confirmacao-icone">
            <CheckCircle size={64} color="#026a6e" />
          </div>

          <h1>Pedido Confirmado!</h1>
          <p className="pedido-numero">Pedido #{state.pedidoId}</p>

          <p className="confirmacao-mensagem">
            Seu pedido foi recebido com sucesso e já está sendo processado.
          </p>

          <div className="etapas-container">
            <div className="etapa concluida">
              <div className="etapa-icone">
                <ShoppingBag size={24} />
              </div>
              <div className="etapa-info">
                <h3>Pedido Recebido</h3>
                <p>Seu pedido foi registrado em nosso sistema.</p>
              </div>
            </div>

            <div className="etapa">
              <div className="etapa-icone">
                <Package size={24} />
              </div>
              <div className="etapa-info">
                <h3>Em Preparação</h3>
                <p>Em breve seu pedido será preparado para envio.</p>
              </div>
            </div>
          </div>

          <div className="confirmacao-acoes">
            <button
              className="btn-meus-pedidos"
              onClick={() => navigate("/loja/meus-pedidos")}
            >
              Meus Pedidos
            </button>

            <button
              className="btn-continuar-comprando"
              onClick={() => navigate("/loja")}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConfirmacaoPedido;
