import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import "../styles/NovoAgendamento.css";

interface Endereco {
  id_endereco: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento?: string;
}

interface Pet {
  id_pet: number;
  nome: string;
  especie: string;
}

interface Servico {
  id_servico: number;
  nome: string;
  preco: number;
  tipo?: string;
}

interface HorarioDisponivel {
  hora: string;
  disponivel: boolean;
}

interface NovoAgendamentoProps {
  isOpen: boolean;
  onClose: () => void;
  servicoPreSelecionado?: number;
}

const NovoAgendamento = ({
  isOpen,
  onClose,
  servicoPreSelecionado,
}: NovoAgendamentoProps) => {
  const { user } = useAuth();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"successo" | "erro">("successo");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<
    HorarioDisponivel[]
  >([]);

  const [formData, setFormData] = useState({
    petId: "",
    enderecoId: "",
    servicoId: servicoPreSelecionado?.toString() || "",
    data: "",
    horario: "",
    descricaoSintomas: "",
    precisaTransporte: false,
    formaPagamento: "", // Nova propriedade para forma de pagamento
  });

  const isConsulta = (servicoId: string) => {
    const servico = servicos.find((s) => s.id_servico === parseInt(servicoId));
    return servico?.nome.toLowerCase().includes("consulta");
  };

  const carregarDados = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        setToastMessage("Usuário não autenticado");
        setToastType("erro");
        setShowToast(true);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [enderecosRes, petsRes, servicosRes] = await Promise.all([
        api.get(`/enderecos/usuario/${user.id}`, config),
        api.get(`/pets/usuario/${user.id}`, config),
        api.get(`/servicos`, config),
      ]);

      console.log("Dados carregados:", {
        enderecos: enderecosRes.data,
        pets: petsRes.data,
        servicos: servicosRes.data,
      });

      setEnderecos(enderecosRes.data);
      setPets(petsRes.data);
      setServicos(servicosRes.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error.response || error);
      setToastMessage(
        error.response?.data?.message || "Erro ao carregar dados"
      );
      setToastType("erro");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user?.id) {
      carregarDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (servicoPreSelecionado) {
      setFormData((prev) => ({
        ...prev,
        servicoId: servicoPreSelecionado.toString(),
      }));
    }
  }, [servicoPreSelecionado]);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Tratamento especial para checkbox
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "data") {
      setHorariosDisponiveis(
        gerarHorariosBase().map((hora) => ({
          hora,
          disponivel: true,
        }))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        setToastMessage("Usuário não autenticado");
        setToastType("erro");
        setShowToast(true);
        return;
      }
      if (
        !formData.petId ||
        !formData.servicoId ||
        !formData.data ||
        !formData.horario ||
        !formData.formaPagamento ||
        (formData.precisaTransporte && !formData.enderecoId)
      ) {
        setToastMessage("Todos os campos são obrigatórios");
        setToastType("erro");
        setShowToast(true);
        return;
      }

      if (
        isConsulta(formData.servicoId) &&
        !formData.descricaoSintomas.trim()
      ) {
        setToastMessage(
          "Por favor, descreva os sintomas do pet para a consulta"
        );
        setToastType("erro");
        setShowToast(true);
        return;
      }
      const agendamentoData = {
        id_pet: parseInt(formData.petId),
        id_endereco: formData.precisaTransporte
          ? parseInt(formData.enderecoId)
          : null,
        id_servico: parseInt(formData.servicoId),
        data: formData.data,
        horario: formData.horario,
        id_usuario: user.id,
        status: "Agendado",
        descricao_sintomas: formData.descricaoSintomas || null,
        precisa_transporte: formData.precisaTransporte === true,
        forma_pagamento: formData.formaPagamento,
      };

      const response = await api.post("/agendamentos", agendamentoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        setToastMessage("Agendamento realizado com sucesso!");
        setToastType("successo");
        setShowToast(true);
        setFormData({
          petId: "",
          enderecoId: "",
          servicoId: "",
          data: "",
          horario: "",
          descricaoSintomas: "",
          precisaTransporte: false,
          formaPagamento: "",
        });

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao criar agendamento", error);
      setToastMessage("Erro ao criar agendamento");
      setToastType("erro");
      setShowToast(true);
    }
  };

  const getDataMinima = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate() + 1).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Agendamento">
      <div className="novo-agendamento-container">
        <Toast
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="agendamento-form">
            <div className="form-group">
              <label>Pet:</label>
              <select
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um pet</option>
                {pets.map((pet) => (
                  <option key={pet.id_pet} value={pet.id_pet}>
                    {pet.nome} ({pet.especie})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Serviço:</label>
              <select
                name="servicoId"
                value={formData.servicoId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um serviço</option>
                {servicos.map((servico) => (
                  <option key={servico.id_servico} value={servico.id_servico}>
                    {servico.nome} - R$ {servico.preco}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo de descrição condicional */}
            {isConsulta(formData.servicoId) && (
              <div className="form-group">
                <label>Descrição dos Sintomas:</label>
                <textarea
                  name="descricaoSintomas"
                  value={formData.descricaoSintomas}
                  onChange={handleChange}
                  placeholder="Descreva detalhadamente os sintomas do seu pet..."
                  required
                  rows={4}
                  className="sintomas-textarea"
                />
              </div>
            )}

            {/* Novo campo - checkbox de transporte */}
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="precisaTransporte"
                  checked={formData.precisaTransporte}
                  onChange={handleChange}
                />
                <span className="checkbox-label">Precisa de transporte?</span>
                <span className="checkbox-info">
                  (Taxa adicional será cobrada)
                </span>
              </label>
            </div>

            {/* Endereço aparece somente se precisar de transporte */}
            {formData.precisaTransporte && (
              <div className="form-group">
                <label>Endereço para buscar o pet:</label>
                <select
                  name="enderecoId"
                  value={formData.enderecoId}
                  onChange={handleChange}
                  required={formData.precisaTransporte}
                >
                  <option value="">Selecione um endereço</option>
                  {enderecos.map((endereco) => (
                    <option
                      key={endereco.id_endereco}
                      value={endereco.id_endereco}
                    >
                      {endereco.rua}, {endereco.numero} - {endereco.bairro}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Data:</label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  min={getDataMinima()}
                  required
                />
              </div>

              <div className="form-group">
                <label>Horário:</label>
                <select
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  required
                  disabled={!formData.data}
                >
                  <option value="">Selecione um horário</option>
                  {horariosDisponiveis.map(
                    (horario) =>
                      horario.disponivel && (
                        <option key={horario.hora} value={horario.hora}>
                          {horario.hora}
                        </option>
                      )
                  )}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Forma de Pagamento:</label>
              <select
                name="formaPagamento"
                value={formData.formaPagamento}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma forma de pagamento</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Dinheiro">Dinheiro (na hora do serviço)</option>
                <option value="PIX">PIX</option>
              </select>
              <p className="pagamento-info">
                {formData.formaPagamento === "PIX" &&
                  "As instruções de PIX serão enviadas por e-mail"}
                {formData.formaPagamento === "Cartão de Crédito" &&
                  "O pagamento será processado no momento da confirmação"}
                {formData.formaPagamento === "Dinheiro" &&
                  "Pague diretamente ao prestador de serviço"}
              </p>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-confirmar">
                Confirmar
              </button>
              <button type="button" className="btn-cancelar" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default NovoAgendamento;
