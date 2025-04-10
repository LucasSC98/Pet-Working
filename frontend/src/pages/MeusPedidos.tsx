import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import TelaConfirmacao from "../components/TelaConfirmacao";
import Toast from "../components/Toast";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "../styles/MeusPedidos.css";
import { Package, ChevronDown, ChevronRight } from "lucide-react";

interface Produto {
  id_produto: number;
  nome: string;
  foto: string;
}

interface ItemPedido {
  id_item_pedido: number;
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  produto: Produto;
}

interface Endereco {
  id_endereco: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
}

interface Pedido {
  id_pedido: number;
  status: string;
  data_pedido: string;
  valor_total: number;
  frete: number;
  observacoes?: string;
  itens: ItemPedido[];
  endereco: Endereco;
}

const MeusPedidos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<number | null>(
    null
  );
  const [acaoAtual, setAcaoAtual] = useState<
    "cancelar" | "excluir" | "entregar" | null
  >(null);
  const [tituloConfirmacao, setTituloConfirmacao] = useState("");
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"successo" | "erro">("successo");

  const carregarPedidos = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await api.get(`/pedidos/usuario/${user.id}`);
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      setToastMessage("Erro ao carregar pedidos");
      setToastType("erro");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusClasse = (status: string) => {
    switch (status) {
      case "Cancelado":
        return "status-cancelado";
      case "Entregue":
        return "status-entregue";
      case "Enviado":
        return "status-enviado";
      case "Em Preparação":
        return "status-preparacao";
      case "Pagamento Confirmado":
        return "status-pago";
      default:
        return "status-aguardando";
    }
  };

  const toggleExpandirPedido = (pedidoId: number) => {
    setPedidoExpandido(pedidoExpandido === pedidoId ? null : pedidoId);
  };

  const iniciarCancelamento = (pedidoId: number) => {
    setPedidoSelecionado(pedidoId);
    setAcaoAtual("cancelar");
    setTituloConfirmacao("Cancelar Pedido");
    setMensagemConfirmacao(
      "Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita."
    );
    setConfirmacaoAberta(true);
  };

  const iniciarExclusao = (pedidoId: number) => {
    setPedidoSelecionado(pedidoId);
    setAcaoAtual("excluir");
    setTituloConfirmacao("Excluir Pedido");
    setMensagemConfirmacao(
      "Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita."
    );
    setConfirmacaoAberta(true);
  };

  const iniciarConfirmacaoEntrega = (pedidoId: number) => {
    setPedidoSelecionado(pedidoId);
    setAcaoAtual("entregar");
    setTituloConfirmacao("Confirmar Recebimento");
    setMensagemConfirmacao(
      "Confirma que recebeu este pedido? O status será alterado para 'Entregue'."
    );
    setConfirmacaoAberta(true);
  };

  const confirmarAcao = async () => {
    if (!pedidoSelecionado) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (acaoAtual === "cancelar") {
        const response = await api.patch(
          `/pedidos/${pedidoSelecionado}/status`,
          { status: "Cancelado" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          setToastMessage("Pedido cancelado com sucesso!");
          setToastType("successo");
          setShowToast(true);
        }
      } else if (acaoAtual === "excluir") {
        const response = await api.delete(`/pedidos/${pedidoSelecionado}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setToastMessage("Pedido excluído com sucesso!");
          setToastType("successo");
          setShowToast(true);
        }
      } else if (acaoAtual === "entregar") {
        const response = await api.patch(
          `/pedidos/${pedidoSelecionado}/status`,
          {
            status: "Entregue",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setToastMessage("Pedido marcado como entregue!");
          setToastType("successo");
          setShowToast(true);
        }
      }

      await carregarPedidos();
    } catch (error) {
      console.error(`Erro ao ${acaoAtual} pedido:`, error);
      setToastMessage(`Erro ao ${acaoAtual} pedido. Tente novamente.`);
      setToastType("erro");
      setShowToast(true);
    } finally {
      setLoading(false);
      fecharConfirmacao();
    }
  };

  const fecharConfirmacao = () => {
    setConfirmacaoAberta(false);
    setPedidoSelecionado(null);
    setAcaoAtual(null);
  };

  return (
    <DashboardLayout>
      <section className="meus-pedidos-container">
        <h1>Meus Pedidos</h1>

        <Toast
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />

        <TelaConfirmacao
          aberto={confirmacaoAberta}
          titulo={tituloConfirmacao}
          mensagem={mensagemConfirmacao}
          onConfirmar={confirmarAcao}
          onCancelar={fecharConfirmacao}
        />

        {loading && !confirmacaoAberta ? (
          <div className="loading">Carregando pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="sem-pedidos">
            <Package size={64} />
            <h2>Você ainda não tem nenhum pedido</h2>
            <p>Que tal conhecer nossos produtos?</p>
            <button className="btn-explorar" onClick={() => navigate("/loja")}>
              Explorar Loja
            </button>
          </div>
        ) : (
          <div className="pedidos-lista">
            {pedidos.map((pedido) => (
              <div key={pedido.id_pedido} className="pedido-card">
                <div
                  className="pedido-cabecalho"
                  onClick={() => toggleExpandirPedido(pedido.id_pedido)}
                >
                  <div className="pedido-info-principal">
                    <div className="pedido-numero-container">
                      <div className="pedido-numero">
                        <span>Pedido #</span>
                        <strong>{pedido.id_pedido}</strong>
                      </div>
                      <div className="pedido-data">
                        {formatarData(pedido.data_pedido)}
                      </div>
                    </div>
                  </div>

                  <div className="pedido-info-secundaria">
                    <div
                      className={`pedido-status ${getStatusClasse(
                        pedido.status
                      )}`}
                    >
                      {pedido.status}
                    </div>
                    <div className="pedido-valor">
                      R$ {parseFloat(pedido.valor_total.toString()).toFixed(2)}
                    </div>
                    <div className="pedido-expandir">
                      {pedidoExpandido === pedido.id_pedido ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </div>
                  </div>
                </div>

                {pedidoExpandido === pedido.id_pedido && (
                  <div className="pedido-detalhes">
                    <div className="pedido-itens">
                      <h3>Itens do Pedido</h3>
                      <div className="itens-lista">
                        {pedido.itens && pedido.itens.length > 0 ? (
                          pedido.itens.map((item) => (
                            <div
                              key={item.id_item_pedido}
                              className="item-pedido"
                            >
                              <div className="item-info">
                                <img
                                  src={
                                    item.produto?.foto ||
                                    "/placeholder-produto.png"
                                  }
                                  alt={item.produto?.nome || "Produto"}
                                />
                                <div>
                                  <p className="item-nome">
                                    {item.produto?.nome || "Produto sem nome"}
                                  </p>
                                  <p className="item-qtd">
                                    Qtd: {item.quantidade || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Nenhum item disponível</p>
                        )}
                      </div>
                    </div>

                    {pedido.endereco ? (
                      <div className="pedido-endereco">
                        <h3>Endereço de Entrega</h3>
                        <p>
                          {pedido.endereco.rua || "Rua não informada"},{" "}
                          {pedido.endereco.numero || "S/N"}
                          {pedido.endereco.complemento &&
                            ` - ${pedido.endereco.complemento}`}
                        </p>
                        <p>
                          {pedido.endereco.bairro || "Bairro não informado"},
                          {pedido.endereco.cidade || "Cidade não informada"}/
                          {pedido.endereco.estado || "UF"}
                        </p>
                      </div>
                    ) : (
                      <div className="pedido-endereco">
                        <h3>Endereço de Entrega</h3>
                        <p>Endereço não disponível</p>
                      </div>
                    )}

                    {pedido.observacoes && (
                      <div className="pedido-observacoes">
                        <h3>Observações</h3>
                        <p>{pedido.observacoes}</p>
                      </div>
                    )}

                    <div className="pedido-resumo">
                      <div className="resumo-linha">
                        <span>Subtotal</span>
                        <span>
                          R${" "}
                          {parseFloat(
                            (pedido.valor_total || 0).toString()
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="resumo-linha">
                        <span>Frete</span>
                        <span>
                          R${" "}
                          {parseFloat((pedido.frete || 0).toString()).toFixed(
                            2
                          )}
                        </span>
                      </div>
                      <div className="resumo-linha total">
                        <span>Total</span>
                        <span>
                          R${" "}
                          {(
                            parseFloat((pedido.valor_total || 0).toString()) +
                            parseFloat((pedido.frete || 0).toString())
                          ).toFixed(2)}
                        </span>
                      </div>

                      <div className="pedido-acoes">
                        {/* Botão para cancelar - exibido apenas se o status NÃO for "Cancelado" nem "Entregue" */}
                        {pedido.status !== "Cancelado" &&
                          pedido.status !== "Entregue" && (
                            <button
                              className="btn-cancelar-pedido"
                              onClick={(e) => {
                                e.stopPropagation();
                                iniciarCancelamento(pedido.id_pedido);
                              }}
                            >
                              Cancelar Pedido
                            </button>
                          )}
                        {pedido.status === "Pagamento Confirmado" && (
                          <button
                            className="btn-entregar-pedido"
                            onClick={(e) => {
                              e.stopPropagation();
                              iniciarConfirmacaoEntrega(pedido.id_pedido);
                            }}
                          >
                            Confirmar Recebimento
                          </button>
                        )}

                        {(pedido.status === "Cancelado" ||
                          pedido.status === "Entregue") && (
                          <button
                            className="btn-excluir-pedido"
                            onClick={(e) => {
                              e.stopPropagation();
                              iniciarExclusao(pedido.id_pedido);
                            }}
                          >
                            Excluir Pedido
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default MeusPedidos;
