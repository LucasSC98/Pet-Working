import { Link } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";
import "../styles/ProdutoCard.css";
import { ShoppingCart, PackageX } from "lucide-react";

interface Produto {
  id_produto: number;
  nome: string;
  descricao: string;
  preco: number | string; // Atualizando tipo para aceitar string ou número
  foto: string;
  categoria: string;
  destaque?: boolean;
  estoque?: number;
}

interface ProdutoCardProps {
  produto: Produto;
}

const ProdutoCard = ({ produto }: ProdutoCardProps) => {
  const { adicionarItem } = useCarrinho();

  const handleAdicionarAoCarrinho = () => {
    // Não permitir adicionar se não houver estoque
    if (foraDeEstoque) return;

    const produtoComPrecoNumerico = {
      ...produto,
      preco:
        typeof produto.preco === "string"
          ? parseFloat(produto.preco)
          : produto.preco,
    };
    adicionarItem(produtoComPrecoNumerico, 1);
  };

  // Verificar se está fora de estoque - consideramos estoque zero ou indefinido como fora de estoque
  const foraDeEstoque =
    (typeof produto.estoque === "number" && produto.estoque <= 0) ||
    produto.estoque === undefined ||
    produto.estoque === null;

  // Função para formatar o preço de forma segura
  const formatarPreco = (preco: number | string): string => {
    // Se for string, tenta converter para número
    if (typeof preco === "string") {
      const precoNumerico = parseFloat(preco);
      if (!isNaN(precoNumerico)) {
        return precoNumerico.toFixed(2);
      }
      return preco; // Se não conseguir converter, retorna a string original
    }

    // Se for número, usa toFixed
    if (typeof preco === "number" && !isNaN(preco)) {
      return preco.toFixed(2);
    }

    // Fallback para casos de erro
    return "0.00";
  };

  return (
    <div className="produto-card">
      {produto.destaque && <span className="destaque-label">Destaque</span>}
      {foraDeEstoque && <span className="estoque-label">Sem Estoque</span>}
      <div className="produto-imagem">
        <img
          src={produto.foto || "/placeholder-produto.png"}
          alt={produto.nome}
        />
      </div>
      <div className="produto-info">
        <h3>{produto.nome}</h3>
        <p className="produto-categoria">{produto.categoria}</p>
        <p className="produto-preco">R$ {formatarPreco(produto.preco)}</p>
      </div>
      <div className="produto-actions">
        <Link
          to={`/loja/produto/${produto.id_produto}`}
          className="btn-detalhes"
        >
          Ver detalhes
        </Link>
        {!foraDeEstoque ? (
          <button
            onClick={handleAdicionarAoCarrinho}
            className="btn-adicionar-carrinho-loja"
            title="Adicionar ao carrinho"
          >
            <ShoppingCart size={16} />
          </button>
        ) : (
          <span className="indisponivel-carrinho" title="Produto indisponível">
            <PackageX size={26} />
          </span>
        )}
      </div>
    </div>
  );
};

export default ProdutoCard;
