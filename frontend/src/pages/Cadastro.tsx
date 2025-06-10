import "../styles/Cadastro.css";
import useBodyClass from "../hooks/useBodyClass";
import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../types/erros";
import { Eye, EyeOff, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import petworkingLogo from "../assets/petrking.png";

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

  // Estado para controlar o DatePicker
  const [startDate, setStartDate] = useState<Date | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"successo" | "erro">("erro");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para manipular alterações da data
  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      // Formatar a data para o formato ISO (YYYY-MM-DD) para o backend
      const formattedDate = format(date, "yyyy-MM-dd");
      // Formatar a data para exibição no input (DD/MM/YYYY)

      // Atualizar o estado com a data formatada
      setFormData({
        ...formData,
        dataNascimento: formattedDate, // Para o backend
      });

      // Fechar o calendário após a seleção
      setCalendarOpen(false);
    }
  };

  // Função para abrir o calendário ao clicar no ícone
  const toggleCalendar = () => {
    setCalendarOpen(!calendarOpen);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setToastType("erro");
      setToastMessage("As senhas não coincidemm");
      setShowToast(true);
      return;
    }

    // Validação da data de nascimento
    if (!formData.dataNascimento) {
      setToastType("erro");
      setToastMessage("Por favor, selecione uma data de nascimento");
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
        dataNascimento: formData.dataNascimento, // Já está no formato YYYY-MM-DD
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
        mensagemErro = apiError.response.data.message || "Erro ao cadastrar";
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
      <header className="header-cadastro">
        <div className="container-logo-cadastro">
          <Link to="/">
            <img
              src={petworkingLogo}
              alt="PetWorking Logo"
              className="logo-cadastro"
            />
          </Link>
        </div>
      </header>
      <div className="wrapper-cadastro">
        {/* Lado esquerdo - Imagem */}
        <div className="cadastro-left-side">
          <div className="cadastro-image-container">
            <img
              src="https://st4.depositphotos.com/12985790/24533/i/450/depositphotos_245332162-stock-photo-selective-focus-golden-retriever-dog.jpg"
              alt="PetWorking"
              className="cadastro-image-card"
            />
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="cadastro-right-side">
          <h1 className="cadastro-title">Cadastro</h1>

          <form className="cadastro-form" onSubmit={handleSubmit}>
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

            {/* Campo de data com DatePicker */}
            <div className="input-box-cadastro">
              <input
                type="text"
                readOnly
                name="dataNascimento"
                value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                placeholder="Data de nascimento"
                title="Clique no ícone para selecionar a data"
                required
              />
              <Calendar
                size={17}
                className="calendario-icon"
                onClick={toggleCalendar}
              />

              {calendarOpen && (
                <div className="date-picker-container">
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    inline
                    locale={ptBR}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()} // Não permite datas futuras
                    showYearDropdown
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    onClickOutside={() => setCalendarOpen(false)}
                  />
                </div>
              )}
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
            >
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>

            <div className="link-login">
              <p>
                Já possui uma conta?{" "}
                <Link to="/login">Faça seu login aqui!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Cadastro;
