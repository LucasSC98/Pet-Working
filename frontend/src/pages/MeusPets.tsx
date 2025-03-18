import {useState, useEffect} from "react";
import useBodyClass from "../hooks/useBodyClass";
import DashboardLayout from "../components/DashboardLayout";


interface pets {
  id_pet: number;
    nome: string;
    idade: number;
    especie: string;
    raca: string;
    foto: string;
}

const MeusPets = () => {
  useBodyClass("dashboard-page");

  const [pets] = useState<pets[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {

        console.log("um dia eu coloco");
     
        } catch (error) {
            console.error("Erro ao carregar pets:", error);
            setLoading(false);
            }
        }
        fetchPets();
    }
    , []);

    return (
        <DashboardLayout>
            <div className="dashboard-content">
                <h1>Meus Pets</h1>
                {loading ? (
                    <p> Você não possui nenhum pet cadastrado</p>
                ) : (
                    <div className="pets-list">
                        {pets.map((pet) => (
                            <div key={pet.id_pet} className="pet-card">
                                <img src={pet.foto} alt={pet.nome} className="pet-avatar" />
                                <div className="pet-info">
                                    <h2>{pet.nome}</h2>
                                    <p>
                                        <strong>Idade:</strong> {pet.idade} anos
                                    </p>
                                    <p>
                                        <strong>Espécie:</strong> {pet.especie}
                                    </p>
                                    <p>
                                        <strong>Raça:</strong> {pet.raca}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}



export default MeusPets;