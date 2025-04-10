import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ProdutoCard from "../components/ProdutoCard";
import "../styles/Loja.css";
import {
  Filter,
  Search,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";
import api from "../services/api";

interface Produto {
  id_produto: number;
  nome: string;
  descricao: string;
  preco: number;
  foto: string;
  categoria: string;
  destaque: boolean;
  estoque?: number;
}

interface PaginacaoData {
  total: number;
  paginas: number;
  atual: number;
  itensPorPagina: number;
}

const Loja = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginacao, setPaginacao] = useState<PaginacaoData>({
    total: 0,
    paginas: 1,
    atual: 1,
    itensPorPagina: 8,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { totalItens } = useCarrinho();

  // Obter parâmetros da URL
  const paginaAtual = Number(searchParams.get("pagina") || "1");
  const categoriaAtiva = searchParams.get("categoria") || "todos";
  const busca = searchParams.get("busca") || "";

  // Constante com todas as categorias disponíveis
  const categorias = [
    "todos",
    "Alimentação",
    "Brinquedos",
    "Acessórios",
    "Higiene",
    "Roupas",
  ];

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("pagina", paginaAtual.toString());
      params.append("itensPorPagina", "8");

      if (categoriaAtiva !== "todos") {
        params.append("categoria", categoriaAtiva);
      }

      if (busca) {
        params.append("busca", busca);
      }
      const resposta = await api.get(`/produtos?${params.toString()}`);

      if (resposta.data && resposta.data.produtos) {
        setProdutos(resposta.data.produtos);
        setPaginacao(resposta.data.paginacao);
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
      setError(
        "Não foi possível carregar os produtos. Tente novamente mais tarde."
      );

      setProdutos([]);
      setPaginacao({
        total: 0,
        paginas: 1,
        atual: 1,
        itensPorPagina: 8,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual, categoriaAtiva, busca]);
  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= paginacao.paginas) {
      setSearchParams((prev) => {
        prev.set("pagina", novaPagina.toString());
        return prev;
      });
      window.scrollTo({
        top:
          (document.querySelector(".loja-container") as HTMLElement)
            ?.offsetTop || 0,
        behavior: "smooth",
      });
    }
  };

  const mudarCategoria = (novaCategoria: string) => {
    setSearchParams((prev) => {
      prev.set("categoria", novaCategoria);
      prev.set("pagina", "1"); // Reset para página 1
      return prev;
    });
  };

  const atualizarBusca = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formBusca = (
      document.getElementById("busca-input") as HTMLInputElement
    ).value;

    setSearchParams((prev) => {
      if (formBusca) {
        prev.set("busca", formBusca);
      } else {
        prev.delete("busca");
      }
      prev.set("pagina", "1"); // Reset para página 1
      return prev;
    });
  };

  return (
    <DashboardLayout>
      <section className="loja-container">
        <div className="loja-header">
          <h1>Loja PetWorking</h1>
          <Link to="/loja/carrinho" className="carrinho-btn">
            <div className="carrinho-icon">
              <ShoppingBag size={20} />
              {totalItens > 0 && (
                <span className="carrinho-contador">{totalItens}</span>
              )}
            </div>
          </Link>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <form className="busca-container" onSubmit={atualizarBusca}>
            <Search size={18} />
            <input
              id="busca-input"
              type="text"
              placeholder="Buscar produtos..."
              defaultValue={busca}
              className="busca-input"
            />
            <button type="submit" className="busca-btn">
              Buscar
            </button>
          </form>

          <div className="categorias-filtro">
            <Filter size={18} />
            <div className="categorias-lista">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  className={`categoria-btn ${
                    categoriaAtiva === categoria ? "ativa" : ""
                  }`}
                  onClick={() => mudarCategoria(categoria)}
                >
                  {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="erro-mensagem">{error}</div>}

        <h2>Produtos</h2>
        {loading ? (
          <div className="loading">Carregando produtos...</div>
        ) : produtos.length > 0 ? (
          <>
            <div className="produtos-grid">
              {produtos.map((produto) => (
                <ProdutoCard key={produto.id_produto} produto={produto} />
              ))}
            </div>

            {/* Paginação */}
            {paginacao.paginas > 1 && (
              <div className="paginacao">
                <button
                  className="btn-pagina"
                  onClick={() => mudarPagina(paginacao.atual - 1)}
                  disabled={paginacao.atual === 1}
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="paginas">
                  {Array.from({ length: paginacao.paginas }, (_, index) => {
                    const numeroPagina = index + 1;

                    if (
                      paginacao.paginas <= 7 ||
                      numeroPagina === 1 ||
                      numeroPagina === paginacao.paginas ||
                      (numeroPagina >= paginacao.atual - 1 &&
                        numeroPagina <= paginacao.atual + 1)
                    ) {
                      return (
                        <button
                          key={numeroPagina}
                          onClick={() => mudarPagina(numeroPagina)}
                          className={`btn-numero-pagina ${
                            numeroPagina === paginacao.atual ? "ativa" : ""
                          }`}
                        >
                          {numeroPagina}
                        </button>
                      );
                    }

                    if (
                      numeroPagina === paginacao.atual - 2 ||
                      numeroPagina === paginacao.atual + 2
                    ) {
                      return (
                        <span key={numeroPagina} className="reticencias">
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}
                </div>

                <button
                  className="btn-pagina"
                  onClick={() => mudarPagina(paginacao.atual + 1)}
                  disabled={paginacao.atual === paginacao.paginas}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="sem-produtos">
            <p>Nenhum produto encontrado para os filtros selecionados.</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Loja;
