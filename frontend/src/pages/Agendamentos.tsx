import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import DashboardLayout from "../components/DashboardLayout";


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
  const [agendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
    
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, []);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="loading">Carregando agendamentos...</div>;
  }

  return (
    <DashboardLayout>
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Meus Agendamentos</h2>
          <Link to="/novo-agendamento" className="btn-primary">Novo Agendamento</Link>
        </div>
        
        {/* Filtros e pesquisa */}
        <div className="filters-bar">
          <div className="filter-options">
            <select className="filter-select">
              <option value="todos">Todos os status</option>
              <option value="agendado">Agendado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        
        {/* Lista de agendamentos */}
        <div className="appointments-list">
          {agendamentos.length > 0 ? (
            agendamentos.map((agendamento) => (
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
                  <button className="btn-cancel">Cancelar</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">Você ainda não tem agendamentos</p>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Agendamentos;