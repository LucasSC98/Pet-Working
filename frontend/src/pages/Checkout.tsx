import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useCarrinho } from "../context/CarrinhoContext";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import "../styles/Checkout.css";
import Toast from "../components/Toast";

interface Endereco {
  id_endereco: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itens, valorTotal, totalItens, limparCarrinho } = useCarrinho();

  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<number>(0);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"successo" | "erro">("successo");

  useEffect(() => {
    if (totalItens === 0) {
      navigate("/loja");
      return;
    }

    const carregarEnderecos = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await api.get(`/enderecos/usuario/${user.id}`);
        setEnderecos(response.data);

        if (response.data.length > 0) {
          setEnderecoSelecionado(response.data[0].id_endereco);
        }
      } catch (error) {
        console.error("Erro ao carregar endereços:", error);
        setToastMessage("Erro ao carregar seus endereços");
        setToastType("erro");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    carregarEnderecos();
  }, [user, navigate, totalItens]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!enderecoSelecionado) {
      setToastMessage("Selecione um endereço para entrega");
      setToastType("erro");
      setShowToast(true);
      return;
    }

    if (!metodoPagamento) {
      setToastMessage("Selecione um método de pagamento");
      setToastType("erro");
      setShowToast(true);
      return;
    }

    try {
      setEnviando(true);

      const pedidoData = {
        id_endereco: enderecoSelecionado,
        observacoes,
        itens: itens.map((item) => ({
          id_produto: item.produto.id_produto,
          quantidade: item.quantidade,
        })),
      };

      const responsePedido = await api.post("/pedidos", pedidoData);

      if (responsePedido.status === 201) {
        const pagamentoData = {
          id_pedido: responsePedido.data.id_pedido,
          metodo: metodoPagamento,
          valor: valorTotal,
          codigo_transacao: `PAG-${Date.now()}`,
        };

        await api.post("/pagamentos", pagamentoData);

        limparCarrinho();

        setToastMessage("Pedido realizado com sucesso!");
        setToastType("successo");
        setShowToast(true);

        setTimeout(() => {
          navigate("/loja/confirmacao", {
            state: { pedidoId: responsePedido.data.id_pedido },
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      setToastMessage("Erro ao finalizar pedido");
      setToastType("erro");
      setShowToast(true);
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Carregando informações...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="checkout-container">
        <Toast
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />

        <h1>Finalizar Compra</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-coluna">
            <div className="secao-checkout">
              <h2>Endereço de Entrega</h2>

              {enderecos.length > 0 ? (
                <div className="enderecos-lista">
                  {enderecos.map((endereco) => (
                    <div
                      key={endereco.id_endereco}
                      className={`endereco-item ${
                        endereco.id_endereco === enderecoSelecionado
                          ? "selecionado"
                          : ""
                      }`}
                      onClick={() =>
                        setEnderecoSelecionado(endereco.id_endereco)
                      }
                    >
                      <div className="radio-personalizado">
                        <input
                          type="radio"
                          name="endereco"
                          checked={endereco.id_endereco === enderecoSelecionado}
                          onChange={() =>
                            setEnderecoSelecionado(endereco.id_endereco)
                          }
                          id={`endereco-${endereco.id_endereco}`}
                        />
                        <span className="checkmark"></span>
                      </div>

                      <div className="endereco-detalhes">
                        <p>
                          {endereco.rua}, {endereco.numero}
                        </p>
                        <p>
                          {endereco.bairro}, {endereco.cidade}/{endereco.estado}
                        </p>
                        <p>CEP: {endereco.cep}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sem-endereco">
                  <p>Você não possui endereços cadastrados.</p>
                  <button
                    type="button"
                    className="btn-novo-endereco"
                    onClick={() => navigate("/minha-conta")}
                  >
                    Cadastrar Endereço
                  </button>
                </div>
              )}
            </div>

            <div className="secao-checkout">
              <h2>Forma de Pagamento</h2>
              <div className="pagamento-opcoes">
                <div
                  className={`pagamento-item ${
                    metodoPagamento === "Cartão de Crédito" ? "selecionado" : ""
                  }`}
                  onClick={() => setMetodoPagamento("Cartão de Crédito")}
                >
                  <div className="radio-personalizado">
                    <input
                      type="radio"
                      name="pagamento"
                      checked={metodoPagamento === "Cartão de Crédito"}
                      onChange={() => setMetodoPagamento("Cartão de Crédito")}
                      id="pagamento-credito"
                    />
                    <span className="checkmark"></span>
                  </div>
                  <span>Cartão de Crédito</span>
                </div>

                <div
                  className={`pagamento-item ${
                    metodoPagamento === "Cartão de Débito" ? "selecionado" : ""
                  }`}
                  onClick={() => setMetodoPagamento("Cartão de Débito")}
                >
                  <div className="radio-personalizado">
                    <input
                      type="radio"
                      name="pagamento"
                      checked={metodoPagamento === "Cartão de Débito"}
                      onChange={() => setMetodoPagamento("Cartão de Débito")}
                      id="pagamento-debito"
                    />
                    <span className="checkmark"></span>
                  </div>
                  <span>Cartão de Débito</span>
                </div>

                <div
                  className={`pagamento-item ${
                    metodoPagamento === "PIX" ? "selecionado" : ""
                  }`}
                  onClick={() => setMetodoPagamento("PIX")}
                >
                  <div className="radio-personalizado">
                    <input
                      type="radio"
                      name="pagamento"
                      checked={metodoPagamento === "PIX"}
                      onChange={() => setMetodoPagamento("PIX")}
                      id="pagamento-pix"
                    />
                    <span className="checkmark"></span>
                  </div>
                  <span>PIX</span>
                </div>

                <div
                  className={`pagamento-item ${
                    metodoPagamento === "Boleto" ? "selecionado" : ""
                  }`}
                  onClick={() => setMetodoPagamento("Boleto")}
                >
                  <div className="radio-personalizado">
                    <input
                      type="radio"
                      name="pagamento"
                      checked={metodoPagamento === "Boleto"}
                      onChange={() => setMetodoPagamento("Boleto")}
                      id="pagamento-boleto"
                    />
                    <span className="checkmark"></span>
                  </div>
                  <span>Boleto Bancário</span>
                </div>
              </div>
            </div>

            <div className="secao-checkout">
              <h2>Observações</h2>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Informações adicionais sobre a entrega (opcional)"
                rows={4}
              />
            </div>
          </div>

          <div className="checkout-coluna">
            <div className="secao-checkout resumo-pedido">
              <h2>Resumo do Pedido</h2>

              <div className="itens-resumo">
                {itens.map((item) => (
                  <div key={item.produto.id_produto} className="item-resumo">
                    <div className="item-info">
                      <img
                        src={item.produto.foto || "/placeholder-produto.png"}
                        alt={item.produto.nome}
                      />
                      <div>
                        <p className="item-nome">{item.produto.nome}</p>
                        <p className="item-qtd">Qtd: {item.quantidade}</p>
                      </div>
                    </div>
                    <p className="item-preco">
                      R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="resumo-valores">
                <div className="resumo-linha">
                  <span>Subtotal</span>
                  <span>R$ {valorTotal.toFixed(2)}</span>
                </div>
                <div className="resumo-linha">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="resumo-linha total">
                  <span>Total</span>
                  <span>R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-finalizar-compra"
                disabled={enviando || !enderecoSelecionado || !metodoPagamento}
              >
                {enviando ? "Processando..." : "Finalizar Compra"}
              </button>

              <button
                type="button"
                className="btn-voltar"
                onClick={() => navigate("/loja/carrinho")}
              >
                Voltar ao Carrinho
              </button>
            </div>
          </div>
        </form>
      </section>
    </DashboardLayout>
  );
};

export default Checkout;
