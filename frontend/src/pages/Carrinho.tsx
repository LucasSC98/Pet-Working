import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useCarrinho } from "../context/CarrinhoContext";
import "../styles/Carrinho.css";
import { Trash, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";

const Carrinho = () => {
  const navigate = useNavigate();
  const { itens, removerItem, atualizarQuantidade, valorTotal, totalItens } =
    useCarrinho();

  const incrementarQuantidade = (
    produtoId: number,
    quantidadeAtual: number,
    estoque: number | undefined
  ) => {
    if (estoque && quantidadeAtual < estoque) {
      atualizarQuantidade(produtoId, quantidadeAtual + 1);
    }
  };

  const decrementarQuantidade = (
    produtoId: number,
    quantidadeAtual: number
  ) => {
    if (quantidadeAtual > 1) {
      atualizarQuantidade(produtoId, quantidadeAtual - 1);
    }
  };

  return (
    <DashboardLayout>
      <section className="carrinho-container">
        <div className="carrinho-header">
          <h1>Meu Carrinho</h1>
          <button
            className="btn-continuar-comprando"
            onClick={() => navigate("/loja")}
          >
            <ArrowLeft size={16} />
            Continuar Comprando
          </button>
        </div>

        {totalItens === 0 ? (
          <div className="carrinho-vazio">
            <ShoppingBag size={64} />
            <p>Seu carrinho está vazio</p>
            <button className="btn-explorar" onClick={() => navigate("/loja")}>
              Explorar Produtos
            </button>
          </div>
        ) : (
          <div className="carrinho-conteudo">
            <div className="carrinho-itens">
              <div className="carrinho-cabecalho">
                <span className="col-produto">Produto</span>
                <span className="col-preco">Preço</span>
                <span className="col-quantidade">Quantidade</span>
                <span className="col-subtotal">Subtotal</span>
                <span className="col-acao"></span>
              </div>

              <div className="carrinho-lista">
                {itens.map((item) => (
                  <div key={item.produto.id_produto} className="carrinho-item">
                    <div className="col-produto">
                      <img
                        src={item.produto.foto || "/placeholder-produto.png"}
                        alt={item.produto.nome}
                      />
                      <div>
                        <h3>{item.produto.nome}</h3>
                        <p>{item.produto.categoria}</p>
                      </div>
                    </div>

                    <div className="col-preco">
                      R$ {item.produto.preco.toFixed(2)}
                    </div>

                    <div className="col-quantidade">
                      <div className="quantidade-container">
                        <button
                          onClick={() =>
                            decrementarQuantidade(
                              item.produto.id_produto,
                              item.quantidade
                            )
                          }
                          className="btn-quantidade"
                          disabled={item.quantidade <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantidade-display">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() =>
                            incrementarQuantidade(
                              item.produto.id_produto,
                              item.quantidade,
                              item.produto.estoque
                            )
                          }
                          className="btn-quantidade"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="col-subtotal">
                      R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                    </div>

                    <div className="col-acao">
                      <button
                        onClick={() => removerItem(item.produto.id_produto)}
                        className="btn-remover"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="carrinho-resumo">
              <h2>Resumo do Pedido</h2>
              <div className="resumo-item">
                <span>Produtos ({totalItens})</span>
                <span>R$ {valorTotal.toFixed(2)}</span>
              </div>
              <div className="resumo-item">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <div className="resumo-total">
                <span>Total</span>
                <span>R$ {valorTotal.toFixed(2)}</span>
              </div>
              <button
                className="btn-finalizar"
                onClick={() => navigate("/loja/checkout")}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Carrinho;
