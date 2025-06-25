import { Sequelize } from "sequelize";
import dotenv from "dotenv";


dotenv.config(); 


const isTest = process.env.NODE_ENV === "test";
const bancoDeDadosNM = isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME;


if (!bancoDeDadosNM) {
  throw new Error("Banco de dados não foi definido");
}

const sequelize = new Sequelize(
  bancoDeDadosNM,
  process.env.DB_USER || "",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: Number(process.env.DB_PORT),
    logging: false,
  }
);


export default sequelize;
