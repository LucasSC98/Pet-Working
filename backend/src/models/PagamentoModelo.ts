import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class PagamentoModelo extends Model {
  public id_pagamento!: number;
  public id_pedido!: number;
  public metodo!: string;
  public status!: string;
  public valor!: number;
  public data_pagamento!: Date;
  public codigo_transacao!: string;
}

PagamentoModelo.init(
  {
    id_pagamento: {
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
    metodo: {
      type: DataTypes.ENUM(
        "Cartão de Crédito",
        "Cartão de Débito",
        "PIX",
        "Boleto",
        "Dinheiro"
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Pendente",
        "Aprovado",
        "Recusado",
        "Estornado",
        "Em Análise"
      ),
      defaultValue: "Pendente",
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    data_pagamento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    codigo_transacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "pagamento",
    tableName: "pagamentos",
    timestamps: true,
  }
);

export default PagamentoModelo;
