import { useState, useEffect } from "react";
import useBodyClass from "../hooks/useBodyClass";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "../styles/MeusPets.css";
import CadastroPet from "./CadastroPet";
import Toast from "../components/Toast";
import { Pencil, Trash } from "lucide-react";
import TelaConfirmacao from "../components/TelaConfirmacao";

interface Pet {
  id_pet: number;
  nome: string;
  idade: number;
  especie: string;
  raca: string;
  foto: string;
  peso: number;
  descricao: string;
}

const MeusPets = () => {
  useBodyClass("dashboard-page");
  const { user } = useAuth();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCadastro, setShowCadastro] = useState(false);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
  const [tipoNotificacao, setTipoNotificacao] = useState<"successo" | "erro">(
    "successo"
  );
  const [mensagemNotificacao, setMensagemNotificacao] = useState("");
  const [petEmEdicao, setPetEmEdicao] = useState<Pet | null>(null);
  const [petParaDeletar, setPetParaDeletar] = useState<Pet | null>(null);

  const petsAdicionados = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/pets/usuario/${user.id}`);
      setPets(response.data);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
      setError(
        "Não foi possível carregar seus pets. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarPet = async (idPet: number) => {
    if (!user?.id) return;

    try {
      await api.delete(`/pets/${idPet}/usuario/${user.id}`);
      await petsAdicionados();
      setTipoNotificacao("successo");
      setMensagemNotificacao("Pet removido com sucesso!");
      setMostrarNotificacao(true);
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      setTipoNotificacao("erro");
      setMensagemNotificacao("Erro ao deletar pet. Tente novamente.");
      setMostrarNotificacao(true);
    }
  };

  const handleEditarPet = (pet: Pet) => {
    setPetEmEdicao(pet);
  };

  const handleDeletarClick = (pet: Pet) => {
    setPetParaDeletar(pet);
  };

  useEffect(() => {
    petsAdicionados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-content">
          <h1>Meus Pets</h1>
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="dashboard-content">
          <h1>Meus Pets</h1>
          <p className="error-message">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TelaConfirmacao
        aberto={!!petParaDeletar}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o pet ${petParaDeletar?.nome}?`}
        onConfirmar={() => {
          if (petParaDeletar) {
            handleDeletarPet(petParaDeletar.id_pet);
            setPetParaDeletar(null);
          }
        }}
        onCancelar={() => setPetParaDeletar(null)}
      />
      <div className="dashboard-content">
        <Toast
          message={mensagemNotificacao}
          type={tipoNotificacao}
          show={mostrarNotificacao}
          onClose={() => setMostrarNotificacao(false)}
        />
        <h1>Meus Pets</h1>
        {pets.length === 0 ? (
          <div className="no-pets-message">
            <h3>Nenhum Pet Cadastrado</h3>
            <p>Você ainda não possui nenhum pet cadastrado.</p>
            <button
              onClick={() => setShowCadastro(true)}
              className="btn-cadastrar-pet"
            >
              Cadastrar Pet
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowCadastro(true)}
              className="btn-cadastrar-pet"
            >
              Cadastrar Novo Pet
            </button>
            <div className="pets-list">
              {pets.map((pet) => (
                <div key={pet.id_pet} className="pet-card">
                  <div className="pet-actions">
                    <button
                      onClick={() => handleEditarPet(pet)}
                      className="btn-editar-pet"
                      title="Editar Pet"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletarClick(pet)}
                      className="btn-deletar-pet"
                      title="Exluir Pet"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                  {pet.foto && <img src={pet.foto} className="pet-avatar" />}
                  <div className="pet-info">
                    <h2>{pet.nome}</h2>
                    <p>
                      <strong>Idade:</strong> {pet.idade}{" "}
                      {pet.idade === 1 ? "ano" : "anos"}
                    </p>
                    <p>
                      <strong>Espécie:</strong> {pet.especie}
                    </p>
                    <p>
                      <strong>Raça:</strong> {pet.raca}
                    </p>
                    <p>
                      <strong>Dono:</strong> {user?.nome}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {petEmEdicao && (
        <CadastroPet
          onClose={() => setPetEmEdicao(null)}
          onPetAdded={petsAdicionados}
          petParaEditar={petEmEdicao}
          modo="edicao"
        />
      )}
      {showCadastro && (
        <CadastroPet
          onClose={() => setShowCadastro(false)}
          onPetAdded={petsAdicionados}
          modo="cadastro"
        />
      )}
    </DashboardLayout>
  );
};

export default MeusPets;
