import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class ItemPedidoModelo extends Model {
  public id_item_pedido!: number;
  public id_pedido!: number;
  public id_produto!: number;
  public quantidade!: number;
  public preco_unitario!: number;
  public subtotal!: number;
}

ItemPedidoModelo.init(
  {
    id_item_pedido: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pedidos",
        key: "id_pedido",
      },
    },
    id_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "produtos",
        key: "id_produto",
      },
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "item_pedido",
    tableName: "itens_pedido",
    timestamps: false,
  }
);

export default ItemPedidoModelo;
