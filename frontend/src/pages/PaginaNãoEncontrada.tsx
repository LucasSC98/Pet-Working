import { Link } from "react-router-dom";
import "../styles/PaginaNaoEncontrada.css";
import { useAuth } from "../hooks/useAuth";

const PaginaNaoEncontrada = () => {
  const { user } = useAuth();
  return (
    <div className="pagina-nao-encontrada-container">
      <div className="pagina-nao-encontrada-conteudo">
        <h1 className="pagina-nao-encontrada-titulo">404</h1>
        <img
          src="https://media.tenor.com/5EBtTFM4nv0AAAAM/hamster-meme.gif"
          alt="Página não encontrada"
          className="pagina-nao-encontrada-imagem"
        />
        <h2 className="pagina-nao-encontrada-subtitulo">Oops!</h2>
        <p className="pagina-nao-encontrada-texto">Página não encontrada</p>
        <Link
          to={user ? "/dashboard" : "/"}
          className="pagina-nao-encontrada-botao"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default PaginaNaoEncontrada;
