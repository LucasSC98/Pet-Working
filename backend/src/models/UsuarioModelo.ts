import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcrypt";
import {
  validarCPF,
  validarEmail,
  validarSenha,
  validarDataNascimento,
} from "../validadores/ValidacaoUsuario";

class UsuarioModelo extends Model {
  public id_usuario!: number;
  public nome!: string;
  public email!: string;
  public cpf!: string;
  public senha!: string;
  public dataNascimento!: Date;
  public fotoDePerfil!: string;
  public genero!: "masculino" | "feminino" | "outro";
  public async verificarSenha(senhaInformada: string) {
    return await bcrypt.compare(senhaInformada, this.senha);
  }
}

UsuarioModelo.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        validarEmail: async (value: string) => {
          if (!validarEmail(value)) {
            throw new Error("Email informado é inválido");
          }
        },
      },
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        validarCPF: async (value: string) => {
          if (!validarCPF(value)) {
            throw new Error("CPF inválido");
          }
        },
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        validarSenha: async (value: string) => {
          if (!validarSenha(value)) {
            throw new Error(
              "Senha inválida, deve conter pelo menos uma letra maiúscula e um número"
            );
          }
        },
      },
    },
    dataNascimento: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        validarDataNascimento: async (value: Date) => {
          if (!validarDataNascimento(value)) {
            throw new Error("O usuário deve ter pelo menos 18 anos de idade");
          }
        },
      },
    },
    fotoDePerfil: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    genero: {
      type: DataTypes.ENUM("masculino", "feminino", "outro"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UsuarioModelo",
    tableName: "usuarios",
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario: UsuarioModelo) => {
        if (usuario.senha && !usuario.senha.startsWith("$2b$")) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
      },
      beforeUpdate: async (usuario: UsuarioModelo) => {
        // Primeiro verifica o email
        if (usuario.changed("email")) {
          throw new Error("Não é permitido alterar o email");
        }

        // Depois trata a senha
        if (usuario.changed("senha")) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
      },
    },
  }
);

export default UsuarioModelo;
