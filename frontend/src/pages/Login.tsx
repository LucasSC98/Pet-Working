import { useState, FormEvent } from "react";
import "../styles/Login.css";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import petworkingLogo from "../assets/petrking.png";

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
      <header className="header-login">
        <div className="container-logo-login">
          <Link to="/">
            <img
              src={petworkingLogo}
              alt="PetWorking Logo"
              className="logo-login"
            />
          </Link>
        </div>
      </header>
      <div className="wrapper-login">
        <div className="login-left-side">
          <div className="login-image-container">
            <img
              src="https://st4.depositphotos.com/12985790/24533/i/450/depositphotos_245332162-stock-photo-selective-focus-golden-retriever-dog.jpg"
              alt="PetWorking"
              className="login-image-card"
            />
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="login-right-side">
          <h1 className="login-greeting">Login</h1>

          <form className="login-form" onSubmit={handleSubmit}>
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
              <a href="#" className="esqueci-senha">
                Esqueci minha senha
              </a>
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
      </div>
    </>
  );
}

export default Login;
