import { useState, FormEvent } from "react";
import Card from "../components/Card";
import "../styles/Login.css";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import petworkingbranco from "../assets/petworking1.png";

function Login() {
  useBodyClass("login-page");
  const { signIn } = useAuth();
  const navigation = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [carregando, setCarregando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      await signIn(formData.email, formData.senha);
      navigation("/dashboard");
    } catch (error: unknown) {
      console.error("Erro ao realizar login:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className="logo-image-login">
        <img src={petworkingbranco} />
      </div>
      <div className="hero-image">
        <img
          src="https://i.imgur.com/I3bpkum.png"
          alt="Cachorro do login"
          className="login-image"
        />
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
                type: mostrarSenha ? "text" : "password",
                name: "senha",
                value: formData.senha,
                placeholder: "Digite sua senha",
                onChange: handleChange,
              }}
            />
            <button
              type="button"
              className="mostrar-senha-login"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <div className="lembrar-esqueceu-acesso">
            <label>
              <input type="checkbox" />
              Lembrar-me
            </label>
          </div>

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
