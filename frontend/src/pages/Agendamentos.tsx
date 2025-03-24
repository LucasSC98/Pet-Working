import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import DashboardLayout from "../components/DashboardLayout";
import NovoAgendamento from "./NovoAgendamento";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import Toast from "../components/Toast";
import '../styles/Agendamentos.css';
import TelaConfirmacao from "../components/TelaConfirmacao";

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
  const location = useLocation();
  const { state } = location;
  const [servicoSelecionado, setServicoSelecionado] = useState<number | undefined>();
  const [showConfirmCancelar, setShowConfirmCancelar] = useState(false);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState<number | null>(null);

  useEffect(() => {
    if (state?.novoAgendamento) {
      setShowNovoAgendamento(true);
      setServicoSelecionado(state.servicoId);
    }
  }, [state]);

  const fetchAgendamentos = async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token || !user?.id) return;

        const response = await api.get(`/agendamentos/usuario/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Ajusta as datas antes de salvar no state
        const agendamentosAjustados = response.data.map((agendamento: Agendamento) => ({
            ...agendamento,
            data: agendamento.data.split('T')[0] // Remove a parte do timestamp
        }));

        setAgendamentos(agendamentosAjustados);
        
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
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-').map(Number);
    
    const data = new Date(Date.UTC(ano, mes - 1, dia));
  
    return data.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroStatus(e.target.value);
  };

  const agendamentosFiltrados = agendamentos.filter(agendamento => 
    filtroStatus === "todos" || agendamento.status.toLowerCase() === filtroStatus
  );

  const handleCancelarClick = (idAgendamento: number) => {
    setAgendamentoParaCancelar(idAgendamento);
    setShowConfirmCancelar(true);
  };

  const handleConfirmarCancelamento = async () => {
    if (!agendamentoParaCancelar) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await api.patch(`/agendamentos/${agendamentoParaCancelar}/cancelar`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 200) {
        setMensagem('Agendamento cancelado com sucesso!');
        setTipoMensagem('successo');
        setShowToast(true);
        fetchAgendamentos();
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      setMensagem('Erro ao cancelar agendamento');
      setTipoMensagem('erro');
      setShowToast(true);
    } finally {
      setShowConfirmCancelar(false);
      setAgendamentoParaCancelar(null);
    }
  };

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
              <option value="agendado">Agendados</option>
              <option value="cancelado">Cancelado</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>
        
        <div className="agendamento-lista">
          {agendamentosFiltrados.length > 0 ? (
            agendamentosFiltrados.map((agendamento) => (
              <div className="agendamento-card" key={agendamento.id_agendamento}>
                <div className="agendamento-info">
                  <p className="agendamento-servico">{agendamento.servico.nome}</p>
                  <p className="agendamento-pet">Pet: {agendamento.pet.nome} ({agendamento.pet.especie})</p>
                  <p className="agendamento-preco">R$ {agendamento.servico.preco.toFixed(2)}</p>
                </div>
                <div className="agendamento-data">
                  <p className="data">{formatarData(agendamento.data)}</p>
                  <p className="horario">{agendamento.horario}</p>
                  <span className={`status ${agendamento.status.toLowerCase()}`}>
                    {agendamento.status}
                  </span>
                </div>
                <div className="agendamento-actions">
                  <Link to={`/agendamentos/${agendamento.id_agendamento}`} className="btn-confirmar">
                    Detalhes
                  </Link>
                  {agendamento.status !== 'cancelado' && (
                    <button 
                      className="btn-cancelar"
                      onClick={() => handleCancelarClick(agendamento.id_agendamento)}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="sem-info">Você ainda não tem agendamentos</p>
          )}
        </div>

        <NovoAgendamento 
          isOpen={showNovoAgendamento}
          onClose={() => {
            setShowNovoAgendamento(false);
            setServicoSelecionado(undefined); // Limpa o serviço selecionado ao fechar
            fetchAgendamentos(); // Atualiza a lista após criar novo agendamento
          }}
          servicoPreSelecionado={servicoSelecionado}
        />

        <TelaConfirmacao
          aberto={showConfirmCancelar}
          titulo="Cancelar Agendamento"
          mensagem="Tem certeza que deseja cancelar este agendamento?"
          onConfirmar={handleConfirmarCancelamento}
          onCancelar={() => {
            setShowConfirmCancelar(false);
            setAgendamentoParaCancelar(null);
          }}
        />
      </section>
    </DashboardLayout>
  );
};

export default Agendamentos;