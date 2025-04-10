import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class ProdutoModelo extends Model {
  public id_produto!: number;
  public nome!: string;
  public descricao!: string;
  public preco!: number;
  public estoque!: number;
  public categoria!: string;
  public foto!: string;
  public destaque!: boolean;
}

ProdutoModelo.init(
  {
    id_produto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    categoria: {
      type: DataTypes.ENUM(
        "Alimentação",
        "Brinquedos",
        "Acessórios",
        "Higiene",
        "Roupas"
      ),
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "produto",
    tableName: "produtos",
    timestamps: true,
  }
);

export default ProdutoModelo;
