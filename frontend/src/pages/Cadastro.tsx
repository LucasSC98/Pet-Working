import Card from "../components/Card";
import "../styles/Cadastro.css";
import "../styles/Login.css";
import useBodyClass from "../hooks/useBodyClass";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../types/erros";
import { Eye, EyeOff, Calendar } from "lucide-react";
import cachorro from "../assets/cachorro.png";
import petworkingbranco from "../assets/petworking1.png";

function Cadastro() {
  useBodyClass("cadastro-page");

  const navigation = useNavigate();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
    dataNascimento: "",
    genero: "",
    fotoDePerfil: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"successo" | "erro">("erro");
  const [mostrarSenha, setMostrarSenha] = useState(false);

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

    if (formData.senha !== formData.confirmarSenha) {
      setToastType("erro");
      setToastMessage("As senhas não coincidem");
      setShowToast(true);
      return;
    }
    const hoje = new Date();
    const dataNascimento = new Date(formData.dataNascimento);
    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesAtual = hoje.getMonth() - dataNascimento.getMonth();

    if (idade < 18 || (idade === 18 && mesAtual < 0)) {
      setToastType("erro");
      setToastMessage("É necessário ter mais de 18 anos para se cadastrar");
      setShowToast(true);
      return;
    }

    setCarregando(true);

    try {
      const response = await api.post("/usuarios", {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        senha: formData.senha,
        dataNascimento: formData.dataNascimento,
        genero: formData.genero,
        fotoDePerfil: formData.fotoDePerfil || "",
      });

      if (response.status === 201) {
        setToastType("successo");
        setToastMessage("Cadastro realizado com sucesso! Fazendo login...");
        setShowToast(true);

        try {
          // vai fazer login automaticamente e redirecionar para a dashboard
          await signIn(formData.email, formData.senha);
        } catch (loginError) {
          console.error("Erro ao fazer login automático:", loginError);
          setToastType("erro");
          setToastMessage(
            "Cadastro realizado, mas não foi possível fazer login automático. Redirecionando..."
          );
          setShowToast(true);
          setTimeout(() => {
            navigation("/login");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      let mensagemErro = "Erro ao realizar cadastro";
      if (error instanceof Error && "response" in error) {
        const apiError = error as ApiError;
        switch (apiError.response.status) {
          case 400:
            mensagemErro = apiError.response.data.message;
            break;
          default:
            mensagemErro =
              apiError.response.data.message || "Erro ao cadastrar";
        }
      }

      setToastType("erro");
      setToastMessage(mensagemErro);
      setShowToast(true);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="logo-img-cadastro">
        <img src={petworkingbranco} alt="logo" />
      </div>
      <div className="cachorro-img">
        <img src={cachorro} alt="cachorro" />
      </div>
      <div className="wrapper-cadastro">
        <div className="logo-container"></div>
        <form onSubmit={handleSubmit} method="post">
          <Card loginLogo="Cadastro"></Card>

          <div className="input-box-cadastro">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              title="Digite seu nome completo"
              required
            />
          </div>
          <div className="input-box-cadastro">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              title="Digite um e-mail válido"
              required
            />
          </div>
          <div className="input-box-cadastro">
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
              title="Digite um CPF válido"
            />
          </div>
          <div className="input-box-cadastro">
            <input
              type={mostrarSenha ? "text" : "password"}
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha"
              title="Digite uma senha com no mínimo 8 caracteres"
              required
            />
            <button
              type="button"
              className="mostrar-senha-cadastro"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          <div className="input-box-cadastro">
            <input
              type={mostrarSenha ? "text" : "password"}
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              placeholder="Confirme sua senha"
              title="Digite a senha igual a anterior"
              required
            />
          </div>
          <div className="input-box-cadastro">
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              placeholder="Data de nascimento"
              title="Digite sua data de nascimento"
              required
            />
            <Calendar size={17} className="calendario-icon" />
          </div>

          <div className="input-box-cadastro">
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
              title="Selecione seu gênero"
            >
              <option value="" disabled>
                Selecione seu gênero
              </option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <button
            className="button-cadastro"
            type="submit"
            disabled={carregando}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>

          <div className="link-login">
            <p>
              Já possui uma conta?{" "}
              <a
                style={{ cursor: "pointer" }}
                onClick={() => navigation("/login")}
              >
                Faça seu login aqui!
              </a>{" "}
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Cadastro;
