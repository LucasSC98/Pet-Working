import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import "../styles/Servicos.css";


interface Servicos {
  id_servico: number;
    nome: string;
    descricao: string;
    preco: number;
    fotoServico: string;

}

const Servicos = () => {
  useBodyClass("dashboard-page");
  const [servicos, setServicos] = useState<Servicos[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarServicos = async () => {
      try {
        const response = await api.get("/servicos");
        setServicos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        setLoading(false);
      }
    };

    buscarServicos();
  }, []);

  const handleAgendarServico = (servicoId: number) => {
    // Navega para a página de agendamentos com o ID do serviço como state
    navigate('/agendamentos', { 
      state: { 
        novoAgendamento: true,
        servicoId: servicoId 
      } 
    });
  };

  if (loading) {
    return <div className="loading">Carregando serviços...</div>;
  }

  return (
    <DashboardLayout>
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Serviços</h2>
        </div>

        <div className="filters-bar">

        </div>

        <div className="servicos-list">
          {servicos.map((servico) => (
            <div key={servico.id_servico} className="servico-card">
              <div className="servico-card-info">
                <img src={servico.fotoServico} alt={servico.nome} />
                <h3>{servico.nome}</h3>
                <p>{servico.descricao}</p>
                <p>R$ {servico.preco.toFixed(2)}</p>
              </div>
              <div className="servico-card-actions">
                <button 
                  onClick={() => handleAgendarServico(servico.id_servico)}
                  className="btn-detalhes"
                >
                  Agendar Serviço
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Servicos;



