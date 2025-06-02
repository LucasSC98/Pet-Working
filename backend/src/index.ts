import https from "https";
import fs from "fs";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRota from "./rotas/autenticacaoRota";
import sequelize from "./config/database";
import rotausuarios from "./rotas/usuariosRota";
import rotapets from "./rotas/petsRotas";
import agendamentorota from "./rotas/agendamentosRota";
import servicorota from "./rotas/servicosRota";
import enderecoRota from "./rotas/enderecoRotas";
import produtoRota from "./rotas/produtosRota";
import pedidosRota from "./rotas/pedidosRota";
import pagamentoRota from "./rotas/pagamentosRota";
import chalk from "chalk";
import "./models/Relacionamento";

const app = express();

const ambiente = process.env.NODE_ENV || "test";

const diretorioCertificados = "./certificados";

console.log(`Iniciando servidor em ambiente: ${ambiente}`);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET, POST, PUT, DELETE, PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(authRota);

app.use(rotausuarios);
app.use(rotapets);
app.use(agendamentorota);
app.use(servicorota);
app.use(enderecoRota);
app.use(produtoRota);
app.use(pedidosRota);
app.use(pagamentoRota);

async function iniciarAplicacao() {
  await sequelize.authenticate();

  // Usar HTTP simples, pois o Nginx gerencia HTTPS
  app.listen(process.env.PORT, () => {
    console.log(
      chalk.green(
        `Servidor rodando em: ${chalk.red(
          `http://localhost:${process.env.PORT}`
        )}`
      )
    );
    console.log(
      chalk.yellow(
        `Banco de dados conectado: ${chalk.red(`${process.env.DB_NAME}`)}`
      )
    );
    console.log(
      chalk.green(`Acesso externo: ${chalk.red(`https://petworking.local`)}`)
    );
    console.log(chalk.green(`Para fechar: ${chalk.red(`CTRL + C`)}`));
  });
}
iniciarAplicacao();
