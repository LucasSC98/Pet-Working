import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class AgendamentoModelo extends Model {
    public id_agendamento!: number
    public data!: Date
    public horario!: string
    public id_usuario!: number
    public id_pet!: number
    public id_servico!: number
    public status!: string
}

AgendamentoModelo.init({
    id_agendamento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    horario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },
    id_pet: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pets',
            key: 'id_pet'
        }
    },
    id_servico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'servicos',
            key: 'id_servico'
        }
    },
    status: {
        type: DataTypes.ENUM('Agendado', 'Cancelado', 'Concluido', 'Remarcado', 'Em andamento'),
        allowNull: false,
        defaultValue: 'Agendado'
    }
}, {
    sequelize,
    tableName: 'agendamentos',
    timestamps: false
})

export default AgendamentoModelo;