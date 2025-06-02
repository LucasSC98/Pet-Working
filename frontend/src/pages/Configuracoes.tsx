import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import Toast from "../components/Toast";
import "../styles/Configuracoes.css";
import api from "../services/api";
import TelaConfirmacao from "../components/TelaConfirmacao";
import { ApiError } from "../types/erros";

const Configuracoes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"successo" | "erro">("successo");
  const [configs, setConfigs] = useState({
    fontSize: "normal",
  });

  useEffect(() => {
    const savedConfigs = localStorage.getItem("petworking-configs");
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs));
    }
  }, []);

  useEffect(() => {
    document.body.style.fontSize =
      configs.fontSize === "large"
        ? "1.2rem"
        : configs.fontSize === "tiny"
        ? "0.8rem"
        : "1rem";

    localStorage.setItem("petworking-configs", JSON.stringify(configs));
  }, [configs]);

  const handleChange = (setting: string, value: string | boolean) => {
    setConfigs((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      const storedUser = localStorage.getItem("@PetWorking:user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData ? userData.token : null;

      if (!user?.id) {
        setToastMessage("Usuário não encontrado");
        setToastType("erro");
        setShowToast(true);
        return;
      }

      if (!token) {
        setToastMessage("Sessão expirada. Por favor, faça login novamente.");
        setToastType("erro");
        setShowToast(true);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        await api.delete(`/usuarios/${user.id}`, config);

        setToastType("successo");
        setToastMessage("Conta deletada com sucesso!");
        setShowToast(true);

        setTimeout(() => {
          localStorage.removeItem("@PetWorking:user");
          navigate("/");
        }, 2000);
      } catch (error) {
        if (error instanceof Error && "response" in error) {
          const apiError = error as ApiError;
          console.error("Erro detalhado:", apiError.response.data);

          const errorMessage =
            apiError.response.data.message ||
            "Erro ao deletar conta. Tente novamente.";

          setToastMessage(errorMessage);
          setToastType("erro");
          setShowToast(true);
        }
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      setToastMessage("Erro ao processar sua solicitação. Tente novamente.");
      setToastType("erro");
      setShowToast(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="configuracoes-container">
        <h2>Configurações de Exibição</h2>

        <div className="config-section">
          <h3>Aparência</h3>

          <div className="config-option">
            <label>Tamanho da Fonte</label>
            <select
              value={configs.fontSize}
              onChange={(e) => handleChange("fontSize", e.target.value)}
            >
              <option value="tiny">Muito Pequeno</option>
              <option value="normal">Normal</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </div>

        <div className="config-deletar-conta">
          <h3>Conta</h3>

          <div className="config-option">
            <div className="excluir-conta">
              <h4>Deletar Conta</h4>
              <p>Todos seus dados serão perdidos.</p>

              <button
                className="botao-excluir"
                onClick={() => setShowConfirmDialog(true)}
              >
                Deletar Minha Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      <TelaConfirmacao
        aberto={showConfirmDialog}
        titulo="Deletar Conta"
        mensagem="Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita."
        onConfirmar={handleDeleteAccount}
        onCancelar={() => setShowConfirmDialog(false)}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </DashboardLayout>
  );
};

export default Configuracoes;
