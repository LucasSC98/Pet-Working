import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import { useCarrinho } from "../context/CarrinhoContext";
import "../styles/DetalhesProduto.css";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Toast from "../components/Toast";

interface Produto {
  id_produto: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  foto: string;
}

const DetalhesProduto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { adicionarItem } = useCarrinho();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"successo" | "erro">("successo");

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        if (!id) return;

        setLoading(true);
        const response = await api.get(`/produtos/${id}`);
        setProduto(response.data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setError("Erro ao carregar informações do produto");
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, [id]);

  const incrementarQuantidade = () => {
    if (produto && quantidade < produto.estoque) {
      setQuantidade((prev) => prev + 1);
    }
  };

  const decrementarQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade((prev) => prev - 1);
    }
  };

  const handleAdicionarAoCarrinho = () => {
    if (produto) {
      adicionarItem(produto, quantidade);
      setToastMessage("Produto adicionado ao carrinho");
      setToastType("successo");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Carregando detalhes do produto...</div>
      </DashboardLayout>
    );
  }

  if (error || !produto) {
    return (
      <DashboardLayout>
        <div className="error">{error || "Produto não encontrado"}</div>
        <button className="btn-voltar" onClick={() => navigate("/loja")}>
          Voltar para Loja
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <section className="detalhes-produto">
        <div className="produto-container">
          <div className="produto-imagem-container">
            <img
              src={produto.foto || "/placeholder-produto.png"}
              alt={produto.nome}
              className="produto-imagem"
            />
          </div>

          <div className="produto-info-container">
            <h1 className="produto-titulo">{produto.nome}</h1>
            <p className="produto-categoria">{produto.categoria}</p>
            <p className="produto-preco">{Number(produto.preco).toFixed(2)}</p>

            <div className="produto-disponibilidade">
              <span
                className={produto.estoque > 0 ? "em-estoque" : "sem-estoque"}
              >
                {produto.estoque > 0
                  ? `${produto.estoque} unidades disponíveis`
                  : "Produto indisponível"}
              </span>
            </div>

            <div className="produto-descricao">
              <h3>Descrição</h3>
              <p>{produto.descricao}</p>
            </div>

            {produto.estoque > 0 && (
              <div className="produto-acoes">
                <div className="quantidade-container">
                  <button
                    onClick={decrementarQuantidade}
                    className="btn-quantidade"
                    disabled={quantidade <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantidade-display">{quantidade}</span>
                  <button
                    onClick={incrementarQuantidade}
                    className="btn-quantidade"
                    disabled={quantidade >= produto.estoque}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAdicionarAoCarrinho}
                  className="btn-adicionar-carrinho"
                >
                  <ShoppingBag size={16} />
                  Adicionar ao Carrinho
                </button>
              </div>
            )}
          </div>
        </div>

        <button className="btn-voltar" onClick={() => navigate("/loja")}>
          Voltar para Loja
        </button>
      </section>
    </DashboardLayout>
  );
};

export default DetalhesProduto;
