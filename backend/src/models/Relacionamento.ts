import UsuarioModelo from "./UsuarioModelo";
import PetModelo from "./PetModelo";    
import ServicoModelo from "./ServicoModelo";
import AgendamentoModelo from "./AgendamentoModelo";


UsuarioModelo.hasMany(PetModelo, {
    foreignKey: 'id_usuario',
    as: 'pets'
});

PetModelo.belongsTo(UsuarioModelo, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});

PetModelo.hasMany(AgendamentoModelo, {
    foreignKey: 'id_pet',
    as: 'agendamentos'
});

AgendamentoModelo.belongsTo(PetModelo, {
    foreignKey: 'id_pet',
    as: 'pet'
});

UsuarioModelo.hasMany(AgendamentoModelo, {
    foreignKey: 'id_usuario',
    as: 'agendamentos'
});

AgendamentoModelo.belongsTo(UsuarioModelo, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});

ServicoModelo.hasMany(AgendamentoModelo, {
    foreignKey: 'id_servico',
    as: 'agendamentos'
});

AgendamentoModelo.belongsTo(ServicoModelo, {
    foreignKey: 'id_servico',
    as: 'servico'
});

export { UsuarioModelo, PetModelo, ServicoModelo, AgendamentoModelo };