import dotenv from "dotenv";
import sequelize from "./config/database";

process.env.NODE_ENV = "test";
dotenv.config();

export async function setupTestDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Erro ao configurar banco de testes:", error);
    throw error;
  }
}

export async function clearTestDatabase() {
  try {
    await sequelize.sync({ force: true });
    await sequelize.close();
  } catch (error) {
    console.error("Erro ao limpar banco de testes:", error);
    throw error;
  }
}
