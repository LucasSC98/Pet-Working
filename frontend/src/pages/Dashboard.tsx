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

interface Pedido {
  id_pedido: number;
  data_pedido: string;
  valor_total: number;
  status: string;
  forma_pagamento: string;
  itens?: Array<{
    id_produto: number;
    quantidade: number;
    produto: {
      nome: string;
      foto: string;
    };
  }>;
}

const Dashboard = () => {
  useBodyClass("dashboard-page");
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const fetchDados = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await api.get(`/pets/usuario/${user.id}`);
      const agendamentosResponse = await api.get(
        `/agendamentos/usuario/${user.id}`
      );
      const servicosResponse = await api.get("/servicos");

      try {
        const pedidosResponse = await api.get(`/pedidos/usuario/${user.id}`);
        setPedidos(pedidosResponse.data);
      } catch (erro) {
        console.error("Erro ao carregar pedidos:", erro);
        setPedidos([]);
      }

      setServicos(servicosResponse.data);
      setPets(response.data);
      setAgendamentos(agendamentosResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const formatarData = (dataString: string) => {
    if (!dataString) return "Data não disponível";

    try {
      // Tenta criar uma data a partir da string original sem modificações
      const data = new Date(dataString);

      // Verifica se a data é válida
      if (isNaN(data.getTime())) {
        console.warn("Data inválida:", dataString);
        return "Data inválida";
      }

      return data.toLocaleDateString("pt-BR");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Erro na data";
    }
  };

  const getProximosAgendamentos = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return agendamentos
      .filter((agendamento) => {
        if (agendamento.status !== "Agendado") return false;
        const [ano, mes, dia] = agendamento.data.split("-").map(Number);
        const [hora, minuto] = agendamento.horario.split(":").map(Number);
        const dataAgendamento = new Date(ano, mes - 1, dia, hora, minuto);

        return dataAgendamento >= hoje;
      })
      .sort((primeiroAgendamento, segundoAgendamento) => {
        const [ano, mes, dia] = primeiroAgendamento.data.split("-").map(Number);
        const [hora, minuto] = primeiroAgendamento.horario
          .split(":")
          .map(Number);
        const dataAgendamentoAtual = new Date(ano, mes - 1, dia, hora, minuto);

        const [anoProximo, mesProximo, diaProximo] = segundoAgendamento.data
          .split("-")
          .map(Number);
        const [horaProximo, minutoProximo] = segundoAgendamento.horario
          .split(":")
          .map(Number);
        const dataProximoAgendamento = new Date(
          anoProximo,
          mesProximo - 1,
          diaProximo,
          horaProximo,
          minutoProximo
        );

        return (
          dataAgendamentoAtual.getTime() - dataProximoAgendamento.getTime()
        );
      })
      .slice(0, 3);
  };

  const getAgendamentosAtivos = () => {
    return agendamentos.filter(
      (agendamento) =>
        agendamento.status === "Agendado" || agendamento.status === "Concluido"
    );
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
              <p className="summary-value">{getAgendamentosAtivos().length}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon order-icon">🛍️</div>
            <div className="summary-details">
              <h3>Pedidos</h3>
              <p className="summary-value">{pedidos.length}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon next-appointment-icon">⏰</div>
            <div className="summary-details">
              <h3>Seu Proximo Agendamento</h3>
              <p className="summary-value">
                {getProximosAgendamentos().length > 0
                  ? formatarData(getProximosAgendamentos()[0].data)
                  : "Nenhum"}
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
          {getProximosAgendamentos().length > 0 ? (
            getProximosAgendamentos().map((agendamento) => (
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

      <section className="dashboard-section pedidos-section">
        <div className="section-header">
          <h2>Meus Últimos Pedidos</h2>
          <Link to="/loja/meus-pedidos" className="view-all">
            Ver todos
          </Link>
        </div>

        <div className="pedido-lista">
          {pedidos.length > 0 ? (
            pedidos.slice(0, 2).map((pedido) => (
              <div className="pedido-card" key={pedido.id_pedido}>
                <div className="pedido-info">
                  <p className="pedido-numero">Pedido #{pedido.id_pedido}</p>
                  <p className="pedido-data">
                    {formatarData(pedido.data_pedido)}
                  </p>
                </div>
                <div className="pedido-detalhe">
                  <span className={`status ${pedido.status.toLowerCase()}`}>
                    {pedido.status}
                  </span>
                  <p className="pedido-valor">
                    R${" "}
                    {typeof pedido.valor_total === "number"
                      ? pedido.valor_total.toFixed(2)
                      : Number(pedido.valor_total).toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="sem-info">Nenhum pedido encontrado</p>
          )}
        </div>

        <div className="action-button">
          <Link to="/loja" className="btn-primary">
            Visitar Loja
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
