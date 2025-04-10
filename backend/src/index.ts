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
import pedidoRota from "./rotas/pedidosRota";
import pagamentoRota from "./rotas/pagamentosRota";
import chalk from "chalk";
import "./models/Relacionamento";

const app = express();
const port = 3000;

const ambiente = process.env.NODE_ENV || "test";

console.log(`Iniciando servidor em ambiente: ${ambiente}`);

app.use(
  cors({
    origin: "http://localhost:5173",
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
app.use(pedidoRota);
app.use(pagamentoRota);

/* sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("database foi sincronizado com sucesso");
  })
  .catch((error) => {
    console.log("deu zica no bagulho", error);
  }); */

async function iniciarAplicacao() {
  await sequelize.authenticate();
  app.listen(port, () => {
    console.log(
      chalk.green(
        `Servidor rodando em: ${chalk.red(`http://localhost:${port}`)}`
      )
    );
    console.log(chalk.green(`Para fechar: ${chalk.red(`CTRL + C`)}`));
  });
}

iniciarAplicacao();
