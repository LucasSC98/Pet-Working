import UsuarioModelo from "./UsuarioModelo";
import PetModelo from "./PetModelo";
import ServicoModelo from "./ServicoModelo";
import AgendamentoModelo from "./AgendamentoModelo";
import EnderecoModelo from "./EnderecoModelo";
import ProdutoModelo from "./ProdutoModelo";
import PedidoModelo from "./PedidoModelo";
import ItemPedidoModelo from "./ItemPedidoModelo";
import PagamentoModelo from "./PagamentoModelo";

const inicializarAssociacoes = () => {
  // relacionamento entre UsuarioModelo e PetModelo
  UsuarioModelo.hasMany(PetModelo, {
    foreignKey: "id_usuario",
    as: "pets",
  });
  PetModelo.belongsTo(UsuarioModelo, {
    foreignKey: "id_usuario",
    as: "usuario",
  });

  // relacionamento entre UsuarioModelo e ServicoModelo
  PetModelo.hasMany(AgendamentoModelo, {
    foreignKey: "id_pet",
    as: "agendamentos",
  });
  AgendamentoModelo.belongsTo(PetModelo, {
    foreignKey: "id_pet",
    as: "pet",
  });

  // relacionamentos existentes
  UsuarioModelo.hasMany(AgendamentoModelo, {
    foreignKey: "id_usuario",
    as: "agendamentos",
  });

  AgendamentoModelo.belongsTo(UsuarioModelo, {
    foreignKey: "id_usuario",
    as: "usuario",
  });

  ServicoModelo.hasMany(AgendamentoModelo, {
    foreignKey: "id_servico",
    as: "agendamentos",
  });

  AgendamentoModelo.belongsTo(ServicoModelo, {
    foreignKey: "id_servico",
    as: "servico",
  });

  // relacionamentos novos para pedidos, itens e pagamentos
  UsuarioModelo.hasMany(PedidoModelo, {
    foreignKey: "id_usuario",
    as: "pedidos",
  });

  PedidoModelo.belongsTo(UsuarioModelo, {
    foreignKey: "id_usuario",
    as: "usuario",
  });

  EnderecoModelo.hasMany(PedidoModelo, {
    foreignKey: "id_endereco",
    as: "pedidos",
  });

  PedidoModelo.belongsTo(EnderecoModelo, {
    foreignKey: "id_endereco",
    as: "endereco",
  });

  PedidoModelo.hasMany(ItemPedidoModelo, {
    foreignKey: "id_pedido",
    as: "itens",
  });

  ItemPedidoModelo.belongsTo(PedidoModelo, {
    foreignKey: "id_pedido",
    as: "pedido",
  });

  ProdutoModelo.hasMany(ItemPedidoModelo, {
    foreignKey: "id_produto",
    as: "itens_pedido",
  });

  ItemPedidoModelo.belongsTo(ProdutoModelo, {
    foreignKey: "id_produto",
    as: "produto",
  });

  PedidoModelo.hasOne(PagamentoModelo, {
    foreignKey: "id_pedido",
    as: "pagamento",
  });

  PagamentoModelo.belongsTo(PedidoModelo, {
    foreignKey: "id_pedido",
    as: "pedido",
  });
};

inicializarAssociacoes();

export {
  UsuarioModelo,
  PetModelo,
  ServicoModelo,
  AgendamentoModelo,
  EnderecoModelo,
  ProdutoModelo,
  PedidoModelo,
  ItemPedidoModelo,
  PagamentoModelo,
};
