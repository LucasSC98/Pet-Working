import sequelize from "../config/database";
import PetModelo from "../models/PetModelo";

async function criarPet(nome: string, idade: number, id_usuario: number, raca: string, especie: string, peso: number, foto: string, descricao: string) {
    try {
        await sequelize.sync();
        return await PetModelo.create({ nome, idade, id_usuario, raca, especie, peso, foto, descricao });
    } finally {
        await sequelize.close();
    }
}

criarPet('Luna', 9, 5, 'SRD', 'GATO', 3, 'ainda num tem', 'gata muito fofa')
    .then(pet => console.log('Pet criado:', pet))
    .catch(erro => console.error('Erro:', erro.message));
