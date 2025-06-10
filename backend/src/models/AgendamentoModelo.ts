import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

// Definindo explicitamente o enum para formas de pagamento
export enum FormaPagamento {
  CARTAO_CREDITO = "Cartão de Crédito",
  DINHEIRO = "Dinheiro",
  PIX = "PIX",
}

class AgendamentoModelo extends Model {
  public id_agendamento!: number;
  public data!: Date;
  public horario!: string;
  public id_usuario!: number;
  public id_pet!: number;
  public id_servico!: number;
  public status!: string;
  public precisa_transporte!: boolean;
  public forma_pagamento!: FormaPagamento;
  public id_endereco?: number | null;
  public descricao_sintomas?: string | null;
}

AgendamentoModelo.init(
  {
    id_agendamento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    horario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao_sintomas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
    id_pet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pets",
        key: "id_pet",
      },
    },
    id_servico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "servicos",
        key: "id_servico",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "Agendado",
        "Cancelado",
        "Concluido",
        "Remarcado",
        "Em andamento"
      ),
      allowNull: false,
      defaultValue: "Agendado",
    },
    precisa_transporte: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    forma_pagamento: {
      type: DataTypes.ENUM(...Object.values(FormaPagamento)),
      allowNull: false,
      defaultValue: FormaPagamento.DINHEIRO,
    },
    id_endereco: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "enderecos",
        key: "id_endereco",
      },
    },
  },
  {
    sequelize,
    tableName: "agendamentos",
    timestamps: false,
  }
);

export default AgendamentoModelo;
