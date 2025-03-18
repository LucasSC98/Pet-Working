import sequelize from "../config/database";
import UsuarioModelo from "../models/UsuarioModelo";

async function buscarUsuario(email: string) {
    const usuario = await UsuarioModelo.findOne({ where: { email } });
    if (!usuario) throw new Error('Usuário não foi encontrado :(');
    return usuario;
}

async function verificarLogin(email: string, senha: string) {
    try {
        await sequelize.sync();
        const usuario = await buscarUsuario(email);
        return await usuario.verificarSenha(senha);
    } finally {
        await sequelize.close();
    }
}

verificarLogin('lucas@gmail.com', '123456')
    .then(resultado => console.log('Login:', resultado))
    .catch(erro => console.error('Erro:', erro.message));