import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class ServicoModelo extends Model {
    public id_servico!: number
    public nome!: string
    public descricao!: string
    public preco!: number
}

ServicoModelo.init({
    id_servico: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        references: {
            model: 'agendamentos',
            key: 'id_servico'
        }
    },
    nome: {
        type: DataTypes.ENUM('Banho', 'Tosa', 'Vacina', 'Cirurgia', 'Consulta', 'Exame', 'Internação', 'Hospedagem'),
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true
        }
    }
}, {
    sequelize,
    tableName: 'servicos',
    timestamps: false
})

export default ServicoModelo;