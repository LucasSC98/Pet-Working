import { Sequelize } from "sequelize";

const isTest = process.env.NODE_ENV === "test";

const sequelize = new Sequelize(
  isTest ? "petworking_test" : "lucasv1",
  "root",
  "",
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false,
  }
);

export default sequelize;
