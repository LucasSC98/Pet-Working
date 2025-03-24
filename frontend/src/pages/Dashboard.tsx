import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useBodyClass from "../hooks/useBodyClass";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

interface Pet {
  id_pet: number;
  nome: string;
  idade: number;
  especie: string;
  raca: string;
  foto: string;
}

interface Agendamento {
  id_agendamento: number;
  data: string;
  horario: string;
  status: string;
  pet: {
    nome: string;
  };
  servico: {
    nome: string;
  };
}

interface Servico {
  id_servico: number;
  nome: string;
  descricao: string;
  fotoServico: string;
}

const Dashboard = () => {
  useBodyClass("dashboard-page");
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false); // Alterado para true
  const [servicos, setServicos] = useState<Servico[]>([]); // Novo estado

  const fetchPets = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await api.get(`/pets/usuario/${user.id}`);
      const agendamentosResponse = await api.get(
        `/agendamentos/usuario/${user.id}`
      );
      const servicosResponse = await api.get("/servicos");
      setServicos(servicosResponse.data);
      setPets(response.data);
      setAgendamentos(agendamentosResponse.data);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return <div className="loading">Carregando informações...</div>;
  }

  return (
    <DashboardLayout>
      <section className="dashboard-section summary-section">
        <h2>Resumo</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon pet-icon">🐾</div>
            <div className="summary-details">
              <h3>Pets</h3>
              <p className="summary-value">{pets.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon appointment-icon">📅</div>
            <div className="summary-details">
              <h3>Agendamentos</h3>
              <p className="summary-value">{agendamentos.length}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon next-appointment-icon">⏰</div>
            <div className="summary-details">
              <h3>Próxima Consulta</h3>
              <p className="summary-value">
                {agendamentos.length > 0
                  ? formatarData(agendamentos[0].data)
                  : "Nenhuma"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section appointments-section">
        <div className="section-header">
          <h2>Próximos Agendamentos</h2>
          <Link to="/agendamentos" className="view-all">
            Ver todos
          </Link>
        </div>

        <div className="agendamento-lista">
          {agendamentos.length > 0 ? (
            agendamentos.slice(0, 2).map((agendamento) => (
              <div
                className="agendamento-card"
                key={agendamento.id_agendamento}
              >
                <div className="agendamento-info">
                  <p className="agendamento-servico">
                    {agendamento.servico.nome}
                  </p>
                  <p className="agendamento-pet">Pet: {agendamento.pet.nome}</p>
                </div>
                <div className="agendamento-data">
                  <p className="data">{formatarData(agendamento.data)}</p>
                  <p className="horario">{agendamento.horario}</p>
                  <span
                    className={`status ${agendamento.status.toLowerCase()}`}
                  >
                    {agendamento.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="sem-info">Nenhum agendamento encontrado</p>
          )}
        </div>

        <div className="action-button">
          <Link to="/agendamentos" className="btn-primary">
            Agendar Serviço
          </Link>
        </div>
      </section>

      <div className="two-column-section">
        <div className="column">
          <section className="dashboard-section pets-section">
            <div className="section-header">
              <h2>Meus Pets</h2>
              <Link to="/pets" className="view-all">
                Ver todos
              </Link>
            </div>
            <div className="dashboard-pets-list">
              {pets.length > 0 ? (
                pets.slice(0, 2).map((pet) => (
                  <div key={pet.id_pet} className="dashboard-pet-card">
                    <img
                      src={pet.foto}
                      className="dashboard-pet-imagem"
                      alt={pet.nome}
                    />
                    <div className="dashboard-pet-info">
                      <h3>{pet.nome}</h3>
                      <p>
                        <strong>Idade:</strong> {pet.idade} anos
                      </p>
                      <p>
                        <strong>Espécie:</strong> {pet.especie}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="sem-info">Nenhum pet encontrado</p>
              )}
            </div>
          </section>
        </div>

        <div className="column">
          <section className="dashboard-section servicos-section">
            <div className="section-header">
              <h2>Serviços Disponíveis</h2>
              <Link to="/servicos" className="view-all">
                Ver todos
              </Link>
            </div>
            <div className="dashboard-servicos-list">
              {servicos.length > 0 ? (
                servicos.slice(0, 2).map((servico) => (
                  <div
                    key={servico.id_servico}
                    className="dashboard-servico-card"
                  >
                    <img
                      src={servico.fotoServico}
                      className="dashboard-servico-imagem"
                      alt={servico.nome}
                    />
                    <div className="dashboard-servico-info">
                      <h3>{servico.nome}</h3>
                      <p>{servico.descricao}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">Nenhum serviço disponível</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
