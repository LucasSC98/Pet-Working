import { useState, FormEvent } from "react";
import Card from "../components/Card";
import "../styles/Login.css";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  useBodyClass("login-page");
  const { signIn } = useAuth();
  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await signIn(formData.email, formData.senha);
      navigation("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro durante o login";
      setErro(errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <> 
      <div className="hero-image">
        <img src="https://i.imgur.com/I3bpkum.png" alt="Cachorro do login" className="login-image" />
      </div>
      <div className="wrapper-login">
        <form onSubmit={handleSubmit}>
          <Card loginLogo="Login"></Card>

          <div className="input-box">
            <Input
              {...{
                type: "email",
                name: "email",
                value: formData.email,
                placeholder: "Digite seu email",
                onChange: handleChange,
              }}
            />
          </div>

          <div className="input-box">
            <Input
              {...{
                type: "password",
                name: "senha",
                value: formData.senha,
                placeholder: "Digite sua senha",
                onChange: handleChange,
              }}
            />
          </div>

          <div className="lembrar-esqueceu-acesso">
            <label>
              <input type="checkbox" />
              Lembrar-me
            </label>
          </div>
          {erro && <div className="erro-mensagem">{erro}</div>}

          <button type="submit" className="button" disabled={carregando}>
            {carregando ? "Entrando..." : "Login"}
          </button>

          <div className="link-registro">
            <p>
              Não tem uma conta? <Link to="/cadastro">Registre-se aqui!</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
