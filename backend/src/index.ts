import express from 'express'
import cors from 'cors'
import authRota from './rotas/autenticacaoRota'
import sequelize from './config/database'
import rotausuarios from './rotas/usuariosRota'
import rotapets from './rotas/petsRotas'
import agendamentorota from './rotas/agendamentosRota'
import servicorota from './rotas/servicosRota'
import enderecoRota from './rotas/enderecoRotas'
import chalk from 'chalk'

const app = express()
const port = 3000

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET, POST, PUT, DELETE, PATCH'],
    credentials: true
}))
app.use(express.json())
app.use(authRota);

app.use(rotausuarios)
app.use(rotapets)
app.use(agendamentorota)
app.use(servicorota)
app.use(enderecoRota)

async function iniciarAplicacao() {
    await sequelize.authenticate()
    app.listen(port, () => {
        console.log(chalk.green(`Servidor rodando em: ${chalk.red(`http://localhost:${port}`)}`))
        console.log(chalk.green(`Para fechar: ${chalk.red(`CTRL + C`)}`))
    })
}

iniciarAplicacao()