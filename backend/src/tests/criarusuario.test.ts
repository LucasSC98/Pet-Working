import sequelize from '../config/database';
import { UsuarioModelo } from '../models/Relacionamento';

async function testarCriacaoUsuario() {
    try {
        await sequelize.sync();
        const usuario = await UsuarioModelo.create({
            nome: 'Lucas Silva',
            email: 'lucas22@gmail.com',
            senha: '123456',
            cpf: '529.982.247-25',
            dataNascimento: new Date('1998-07-04'),
            genero: 'MASCULINO'
        });
        console.log('Usuário criado com sucesso:', {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf,
            genero: usuario.genero
        });

        return usuario;

    } catch (erro: unknown) {
        console.error('Erro ao criar usuário:', erro instanceof Error ? erro.message : erro);
        if (erro instanceof Error && 'parent' in erro) {
            const sqlError = (erro as any).parent;
            console.error('Erro no SQL:', sqlError.code);
            console.error('Mensagem do erro:', sqlError.sqlMessage);
        }
        throw erro;
    } finally {
        try {
            await sequelize.close();
            console.log('Conexão com o banco de dados fechada');
        } catch (closeError) {
            console.error('Erro ao fechar conexão:', closeError);
        }
    }
}

testarCriacaoUsuario();
