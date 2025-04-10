import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Toast from "../components/Toast";

interface Produto {
  id_produto: number;
  nome: string;
  descricao: string;
  preco: number;
  foto: string;
  categoria: string;
  estoque?: number;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface CarrinhoContextProps {
  itens: ItemCarrinho[];
  adicionarItem: (produto: Produto, quantidade: number) => void;
  removerItem: (produtoId: number) => void;
  atualizarQuantidade: (produtoId: number, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  valorTotal: number;
}

const CarrinhoContext = createContext<CarrinhoContextProps>({
  itens: [],
  adicionarItem: () => {},
  removerItem: () => {},
  atualizarQuantidade: () => {},
  limparCarrinho: () => {},
  totalItens: 0,
  valorTotal: 0,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrinho = () => useContext(CarrinhoContext);

interface CarrinhoProviderProps {
  children: ReactNode;
}

export const CarrinhoProvider = ({ children }: CarrinhoProviderProps) => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [toastVisivel, setToastVisivel] = useState(false);
  const [toastMensagem, setToastMensagem] = useState("");
  const [, setToastProduto] = useState<string>("");

  const adicionarItem = (produto: Produto, quantidade: number) => {
    setItens((itensAtuais) => {
      const itemExistente = itensAtuais.find(
        (item) => item.produto.id_produto === produto.id_produto
      );

      const novoCarrinho = itemExistente
        ? itensAtuais.map((item) =>
            item.produto.id_produto === produto.id_produto
              ? { ...item, quantidade: item.quantidade + quantidade }
              : item
          )
        : [...itensAtuais, { produto, quantidade }];

      // Mostrar o toast
      setToastProduto(produto.nome);
      setToastMensagem(`${produto.nome} adicionado ao carrinho!`);
      setToastVisivel(true);

      return novoCarrinho;
    });
  };

  const removerItem = (produtoId: number) => {
    setItens((itensAtuais) =>
      itensAtuais.filter((item) => item.produto.id_produto !== produtoId)
    );
  };

  const atualizarQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(produtoId);
      return;
    }

    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.produto.id_produto === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);

  const valorTotal = itens.reduce(
    (total, item) => total + item.quantidade * item.produto.preco,
    0
  );

  useEffect(() => {
    if (toastVisivel) {
      const timer = setTimeout(() => {
        setToastVisivel(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastVisivel]);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
        valorTotal,
      }}
    >
      {children}
      <Toast
        show={toastVisivel}
        message={toastMensagem}
        type="successo"
        onClose={() => setToastVisivel(false)}
      />
    </CarrinhoContext.Provider>
  );
};
