import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import DashboardLayout from "../components/DashboardLayout";
import NovoAgendamento from "./NovoAgendamento";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import Toast from "../components/Toast";

interface Agendamento {
  id_agendamento: number;
  data: string;
  horario: string;
  status: string;
  pet: {
    nome: string;
    especie: string;
  };
  servico: {
    nome: string;
    preco: number;
  };
}

const Agendamentos = () => {
  useBodyClass("dashboard-page");
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"successo" | "erro">("successo");
  const [showToast, setShowToast] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const fetchAgendamentos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !user?.id) {
        setMensagem('Usuário não autenticado');
        setTipoMensagem("erro");
        setShowToast(true);
        setLoading(false);
        return;
      }

      const response = await api.get(`/agendamentos/usuario/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAgendamentos(response.data);
      
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      setMensagem('Erro ao carregar agendamentos');
      setTipoMensagem("erro");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAgendamentos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroStatus(e.target.value);
  };

  const agendamentosFiltrados = agendamentos.filter(agendamento => 
    filtroStatus === "todos" || agendamento.status.toLowerCase() === filtroStatus
  );

  if (loading) {
    return <div className="loading">Carregando agendamentos...</div>;
  }

  return (
    <DashboardLayout>
      <section className="dashboard-section">
        <Toast 
          message={mensagem}
          type={tipoMensagem}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
        <div className="section-header">
          <h2>Meus Agendamentos</h2>
          <button 
            type="button" 
            onClick={() => setShowNovoAgendamento(true)}
            className="btn-primary"
          >
            Novo Agendamento
          </button>
        </div>
        
        <div className="filters-bar">
          <div className="filter-options">
            <select 
              className="filter-select"
              value={filtroStatus}
              onChange={handleFiltroChange}
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>
        
        <div className="appointments-list">
          {agendamentosFiltrados.length > 0 ? (
            agendamentosFiltrados.map((agendamento) => (
              <div className="appointment-card" key={agendamento.id_agendamento}>
                <div className="appointment-info">
                  <p className="appointment-service">{agendamento.servico.nome}</p>
                  <p className="appointment-pet">Pet: {agendamento.pet.nome} ({agendamento.pet.especie})</p>
                  <p className="appointment-price">R$ {agendamento.servico.preco.toFixed(2)}</p>
                </div>
                <div className="appointment-date">
                  <p className="date">{formatarData(agendamento.data)}</p>
                  <p className="time">{agendamento.horario}</p>
                  <span className={`status ${agendamento.status.toLowerCase()}`}>
                    {agendamento.status}
                  </span>
                </div>
                <div className="appointment-actions">
                  <Link to={`/agendamentos/${agendamento.id_agendamento}`} className="btn-outline">
                    Detalhes
                  </Link>
                  {agendamento.status !== 'cancelado' && (
                    <button className="btn-cancel">Cancelar</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">Você ainda não tem agendamentos</p>
          )}
        </div>

        <NovoAgendamento 
          isOpen={showNovoAgendamento}
          onClose={() => {
            setShowNovoAgendamento(false);
            fetchAgendamentos(); // Atualiza a lista após criar novo agendamento
          }}
        />
      </section>
    </DashboardLayout>
  );
};

export default Agendamentos;