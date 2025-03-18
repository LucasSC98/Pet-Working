import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import UsuarioModelo from "./UsuarioModelo";



class PetModelo extends Model {
    public id_pet!: number
    public nome!: string
    public idade!: number
    public raca!: string
    public especie!: string
    public peso!: number
    public foto!: string
    public descricao!: string
    public id_usuario!: number
}

PetModelo.init({
    id_pet: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    raca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    especie: {
        type: DataTypes.ENUM('Cachorro', 'Gato', 'Roedor', 'Ave', 'Peixe', 'Réptil'),
        allowNull: false
    },
    peso: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 120
        }
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario',   
        }
    }
}, 
    {
    sequelize,
    modelName: 'pet',
    tableName: 'pets',
    timestamps: false
})

export default PetModelo;