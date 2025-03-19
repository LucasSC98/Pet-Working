import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "../styles/CadastroPet.css";
import Input from "../components/Input";
import Toast from "../components/Toast";

interface Pet {
    id_pet?: number;
    nome: string;
    idade: number;
    especie: string;
    raca: string;
    foto: string;
    peso: number;
    descricao: string;
}

interface CadastroPetProps {
  onClose: () => void;
  onPetAdded: () => void;
  petParaEditar?: Pet; // Novo prop opcional
  modo?: 'cadastro' | 'edicao'; // Novo prop para controlar o modo
}

const CadastroPet = ({ onClose, onPetAdded, petParaEditar, modo = 'cadastro' }: CadastroPetProps) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        nome: petParaEditar?.nome || "",
        idade: petParaEditar?.idade?.toString() || "",
        especie: petParaEditar?.especie || "",
        raca: petParaEditar?.raca || "",
        foto: petParaEditar?.foto || "",
        peso: petParaEditar?.peso?.toString() || "",
        descricao: petParaEditar?.descricao || ""
    });
    const [isVisible, setIsVisible] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [mensagemNotificacao, setMensagemNotificacao] = useState('');
    const [tipoNotificacao, setTipoNotificacao] = useState<'successo' | 'erro' | 'mensagem' | 'aviso'>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modo === 'edicao' && petParaEditar) {
                await api.patch(`/pets/${petParaEditar.id_pet}`, {
                    ...formData,
                    id_usuario: user?.id
                });
                setMensagemNotificacao('Pet atualizado com sucesso!');
            } else {
                await api.post("/pets", {
                    ...formData,
                    id_usuario: user?.id
                });
                setMensagemNotificacao('Pet cadastrado com sucesso!');
            }
            
            setTipoNotificacao('successo');
            setShowToast(true);
            onPetAdded();
            
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (error) {
            console.error("Erro:", error);
            setTipoNotificacao('erro');
            setMensagemNotificacao('Erro ao salvar o pet. Tente novamente!');
            setShowToast(true);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleClose = () => {
        const overlay = document.querySelector('.cadastro-pet-overlay');
        if (overlay) {
            overlay.classList.add('sliding-out');
            setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 300); // tempo igual ao da transição no CSS
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`cadastro-pet-overlay sliding-in`}>
            <Toast 
                message={mensagemNotificacao}
                type={tipoNotificacao}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
            <div className="cadastro-pet-container">
                <button 
                    onClick={handleClose}
                    className="close-button"
                >
                    X
                </button>
                <h1>{modo === 'edicao' ? 'Editar Pet' : 'Cadastrar Novo Pet'}</h1>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nome:"
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        textColor="#026a6e"
                    />
                    <Input
                        label="Idade:"
                        type="number"
                        name="idade"
                        value={formData.idade}
                        onChange={handleChange}
                        textColor="#026a6e"
                    />
                    <Input
                        label="Espécie:"
                        type="select"
                        name="especie"
                        value={formData.especie}
                        onChange={handleChange}
                        textColor="#026a6e"
                        placeholder="Selecione a espécie"
                        options={[
                            { value: "", label: "Selecione a espécie" },
                            { value: "Cachorro", label: "Cachorro" },
                            { value: "Gato", label: "Gato" },
                            { value: "Ave", label: "Ave" },
                            { value: "Roedor", label: "Roedor" },
                            { value: "Peixe", label: "Peixe" },
                            { value: "Réptil", label: "Réptil" },
                            { value: "Anfíbio", label: "Anfíbio" },
                            { value: "Inseto", label: "Inseto" },
                            { value: "Aracnídeo", label: "Aracnídeo" },
                            { value: "Equino", label: "Equino" },
                            { value: "Bovino", label: "Bovino" },
                            { value: "Caprino", label: "Caprino" },
                            { value: "Outro", label: "Outro" }
                        ]}
                    />
                    <Input
                        label="Raça:"
                        type="text"
                        name="raca"
                        value={formData.raca}
                        onChange={handleChange}
                        textColor="#026a6e"
                    />
                    <Input
                        label="URL da Foto:"
                        type="text"
                        name="foto"
                        value={formData.foto}
                        onChange={handleChange}
                        textColor="#026a6e"
                    />
                    <Input
                        label="Peso:"
                        type="number"
                        name="peso"
                        value={formData.peso}
                        onChange={handleChange}
                        textColor="#026a6e"
                    />
                    <Input
                        label="Descrição:"
                        type="text"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        textColor="#026a6e"
                        placeholder="Digite uma descrição (opcional)"
                        
                    />
                    <button type="submit" className="btn-primary">
                        {modo === 'edicao' ? 'Salvar Alterações' : 'Cadastrar Pet'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CadastroPet;