import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const CadastroPet = () => {
    const [formData, setFormData] = useState({
        nome: "",
        idade: "",
        especie: "",
        raca: "",
        foto: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Dados do pet:", formData);
        } catch (error) {
            console.error("Erro ao cadastrar pet:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <DashboardLayout>
            <div className="cadastro-pet-container">
                <h1>Cadastrar Novo Pet</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Idade:</label>
                        <input
                            type="number"
                            name="idade"
                            value={formData.idade}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Espécie:</label>
                        <input
                            type="text"
                            name="especie"
                            value={formData.especie}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Raça:</label>
                        <input
                            type="text"
                            name="raca"
                            value={formData.raca}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>URL da Foto:</label>
                        <input
                            type="text"
                            name="foto"
                            value={formData.foto}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">
                        Cadastrar Pet
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CadastroPet;