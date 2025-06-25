import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class PedidoModelo extends Model {
  public id_pedido!: number;
  public id_usuario!: number;
  public id_endereco!: number;
  public status!: string;
  public data_pedido!: Date;
  public valor_total!: number;
  public frete!: number;
  public observacoes!: string;
}

PedidoModelo.init(
  {
    id_pedido: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
    id_endereco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "enderecos",
        key: "id_endereco",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "Aguardando Pagamento",
        "Pagamento Confirmado",
        "Em Preparação",
        "Enviado",
        "Entregue",
        "Cancelado"
      ),
      defaultValue: "Aguardando Pagamento",
      allowNull: false,
    },
    data_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    frete: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "pedido",
    tableName: "pedidos",
    timestamps: true,
  }
);

export default PedidoModelo;
