import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import Toast from "../components/Toast";
import "../styles/Configuracoes.css";
import api from "../services/api";
import TelaConfirmacao from "../components/TelaConfirmacao";

const Configuracoes = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"successo" | "erro">("successo");
  const [configs, setConfigs] = useState({
    fontSize: 'normal',
  });

  useEffect(() => {
    const savedConfigs = localStorage.getItem('petworking-configs');
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs));
    }
  }, []);

  useEffect(() => {

    document.body.style.fontSize = 
      configs.fontSize === 'large' ? '1.2rem' : 
      configs.fontSize === 'tiny' ? '0.8rem' : '1rem';
    
    localStorage.setItem('petworking-configs', JSON.stringify(configs));
  }, [configs]);

  const handleChange = (setting: string, value: string | boolean) => {
    setConfigs(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await api.delete(`/usuarios/${user?.id}`);

      if (response.status === 200) {
        setToastType("successo");
        setToastMessage("Conta deletada com sucesso!");
        setShowToast(true);
        
        // Espera 2 segundos antes de fazer logout e redirecionar
        setTimeout(() => {
          logout();
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      setToastType("erro");
      setToastMessage("Erro ao deletar conta. Tente novamente.");
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
              onChange={(e) => handleChange('fontSize', e.target.value)}
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