import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class EnderecoModelo extends Model {
  public id_endereco!: number;
  public cep!: string;
  public rua!: string;
  public numero!: number;
  public bairro!: string;
  public cidade!: string;
  public estado!: string;
  public id_usuario!: number;
}

EnderecoModelo.init(
  {
    id_endereco: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
  },
  {
    sequelize,
    tableName: "enderecos",
    timestamps: false,
  }
);

export default EnderecoModelo;
