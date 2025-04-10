import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import "../styles/DetalhesAgendamento.css";
import TelaConfirmacao from "../components/TelaConfirmacao";
import Toast from "../components/Toast";

interface Agendamento {
  servico: {
    nome: string;
    preco: number;
  };
  pet: {
    nome: string;
    especie: string;
    foto?: string;
  };
  data: string;
  horario: string;
  status: string;
  descricao_sintomas?: string;
}

const DetalhesAgendamento = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmCancelar, setShowConfirmCancelar] = useState(false);
  const [showEditarHorario, setShowEditarHorario] = useState(false);
  const [novoHorario, setNovoHorario] = useState({
    data: "",
    horario: "",
  });
  const [showConfirmExcluir, setShowConfirmExcluir] = useState(false);

  // Toast states
  const [toastMensagem, setToastMensagem] = useState("");
  const [toastTipo, setToastTipo] = useState<"successo" | "erro">("successo");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/agendamentos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        const agendamentoFormatado: Agendamento = {
          servico: {
            nome: data.servico?.nome || "Serviço não informado",
            preco: data.servico?.preco || 0,
          },
          pet: {
            nome: data.pet?.nome || "Pet não informado",
            especie: data.pet?.especie || "Espécie não informada",
            foto: data.pet?.foto || "",
          },
          data: data.data || "Data não informada",
          horario: data.horario || "Horário não informado",
          status: data.status || "Status não informado",
          descricao_sintomas:
            data.descricao_sintomas || "Descrição não informada",
        };

        setAgendamento(agendamentoFormatado);
        setNovoHorario({ data: data.data, horario: data.horario });
      } catch (error) {
        console.error("Erro ao carregar detalhes do agendamento:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgendamento();
    }
  }, [id]);

  const handleCancelarAgendamento = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `/agendamentos/${id}/cancelar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setToastMensagem("Agendamento cancelado com sucesso!");
        setToastTipo("successo");
        setShowToast(true);
        setShowConfirmCancelar(false);
        setAgendamento((prev) => prev && { ...prev, status: "Cancelado" });
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      setToastMensagem("Erro ao cancelar agendamento");
      setToastTipo("erro");
      setShowToast(true);
    }
  };

  const gerarHorariosBase = () => {
    const horarios = [];
    for (let hora = 8; hora <= 18; hora++) {
      const horaFormatada = hora.toString().padStart(2, "0");
      horarios.push(`${horaFormatada}:00`);
      if (hora < 18) {
        horarios.push(`${horaFormatada}:30`);
      }
    }
    return horarios;
  };

  const calcularDiaSeguinte = () => {
    const hoje = new Date();
    const diaSeguinte = new Date(hoje);
    diaSeguinte.setDate(hoje.getDate() + 1);
    return diaSeguinte.toISOString().split("T")[0];
  };

  const handleMudarHorario = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `/agendamentos/${id}/mudar-horario`,
        novoHorario,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setToastMensagem("Horário alterado com sucesso!");
        setToastTipo("successo");
        setShowToast(true);
        setShowEditarHorario(false);
        setAgendamento((prev) =>
          prev
            ? { ...prev, data: novoHorario.data, horario: novoHorario.horario }
            : prev
        );
      }
    } catch (error) {
      console.error("Erro ao mudar horário:", error);
      setToastMensagem("Erro ao mudar horário");
      setToastTipo("erro");
      setShowToast(true);
    }
  };

  const handleExcluirAgendamento = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/agendamentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setToastMensagem("Agendamento excluído com sucesso!");
        setToastTipo("successo");
        setShowToast(true);
        navigate("/agendamentos");
      }
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      setToastMensagem("Erro ao excluir agendamento");
      setToastTipo("erro");
      setShowToast(true);
    }
  };
  const formatarData = (dataString: string) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split("-").map(Number);

    const data = new Date(Date.UTC(ano, mes - 1, dia));

    return data.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  if (loading) {
    return <div className="loading">Carregando detalhes do agendamento...</div>;
  }

  if (!agendamento) {
    return <div className="error">Agendamento não encontrado.</div>;
  }

  return (
    <DashboardLayout>
      <Toast
        message={toastMensagem}
        type={toastTipo}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <section className="detalhes-agendamento">
        <h2>Detalhes do Agendamento</h2>
        <div className="detalhes-card">
          <div className="informacoes">
            <p>
              <strong>Serviço:</strong>{" "}
              {agendamento.servico?.nome || "Não informado"}
            </p>
            <p>
              <strong>Preço:</strong> R${" "}
              {agendamento.servico?.preco?.toFixed(2) || "0.00"}
            </p>
            <p>
              <strong>Pet:</strong> {agendamento.pet?.nome || "Não informado"} (
              {agendamento.pet?.especie || "Não informado"})
            </p>
            <p>
              <strong>Data:</strong>{" "}
              {formatarData(agendamento.data) || "Não informado"}
            </p>
            <p>
              <strong>Horário:</strong> {agendamento.horario || "Não informado"}
            </p>
            <p>
              <strong>Descrição dos Sintomas:</strong>{" "}
              {agendamento.descricao_sintomas || "Não informado"}
            </p>
            <p>
              <strong>Status:</strong> {agendamento.status || "Não informado"}
            </p>
          </div>
          {agendamento.pet?.foto && (
            <div className="pet-foto">
              <img
                src={agendamento.pet.foto}
                alt={`Foto do pet ${agendamento.pet.nome}`}
                className="foto-pet"
              />
            </div>
          )}
        </div>
        {agendamento.status !== "Cancelado" && (
          <>
            <button
              className="btn-cancelar-agendamento"
              onClick={() => setShowConfirmCancelar(true)}
            >
              Cancelar Agendamento
            </button>
            <button
              className="btn-mudar-horario"
              onClick={() => setShowEditarHorario(true)}
            >
              Mudar Horário
            </button>
          </>
        )}
        {(agendamento.status === "Cancelado" ||
          agendamento.status === "Concluído") && (
          <button
            className="btn-excluir"
            onClick={() => setShowConfirmExcluir(true)}
          >
            Excluir Agendamento
          </button>
        )}
        <TelaConfirmacao
          aberto={showConfirmExcluir}
          titulo="Excluir Agendamento"
          mensagem="Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita."
          onConfirmar={handleExcluirAgendamento}
          onCancelar={() => setShowConfirmExcluir(false)}
        />
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </section>

      {showEditarHorario && (
        <div className="modal-editar-horario">
          <h3>Mudar Horário</h3>
          <label>
            Data:
            <input
              type="date"
              value={novoHorario.data}
              min={calcularDiaSeguinte()}
              onChange={(e) =>
                setNovoHorario((prev) => ({ ...prev, data: e.target.value }))
              }
            />
          </label>
          <label>
            Horário:
            <select
              value={novoHorario.horario}
              onChange={(e) =>
                setNovoHorario((prev) => ({ ...prev, horario: e.target.value }))
              }
            >
              <option value="">Selecione um horário</option>
              {gerarHorariosBase().map((horario) => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleMudarHorario}>Salvar</button>
          <button onClick={() => setShowEditarHorario(false)}>Cancelar</button>
        </div>
      )}

      <TelaConfirmacao
        aberto={showConfirmCancelar}
        titulo="Cancelar Agendamento"
        mensagem="Tem certeza que deseja cancelar este agendamento?"
        onConfirmar={handleCancelarAgendamento}
        onCancelar={() => setShowConfirmCancelar(false)}
      />
    </DashboardLayout>
  );
};

export default DetalhesAgendamento;
