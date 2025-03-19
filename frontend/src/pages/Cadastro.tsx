import Card from "../components/Card";
import "../styles/Cadastro.css";
import "../styles/Login.css";
import useBodyClass from "../hooks/useBodyClass";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Cadastro() {
  useBodyClass("cadastro-page");

  const navigation = useNavigate();

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

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
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
    setErro("");

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem");
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
      console.log("Resposta recebida:", response.status);
      const data = response.data;
      console.log("Dados recebidos:", data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(data.message || "Erro ao cadastrar usuário");
      }

      setSucesso(true);

      setTimeout(() => {
        navigation("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      console.error("Erro no cadastro:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro durante o cadastro";
      setErro(errorMessage);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className="wrapper-cadastro">
        <div className="logo-container">
        </div>
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
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha"
              title="Digite uma senha com no mínimo 8 caracteres"
              required
            />
          </div>
          <div className="input-box-cadastro">
            <input
              type="password"
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
          {erro && <div className="erro-mensagem">{erro}</div>}
          {sucesso && (
            <div className="sucesso-mensagem">
              Cadastro realizado com sucesso! Redirecionando...
            </div>
          )}
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
              <a style={{ cursor: "pointer" }} onClick={() => navigation("/login")}>
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
