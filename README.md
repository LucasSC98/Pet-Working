# 🐾 PetWorking - Sistema de Gestão para Pet Shops

## Sobre o Projeto

PetWorking é uma aplicação web completa desenvolvida para gestão de pet shops, oferecendo funcionalidades para clientes e administradores. O sistema permite gerenciar agendamentos de serviços, vendas de produtos, cadastro de pets e muito mais.

## Funcionalidades Principais

### Gestão de Usuários
- Cadastro e autenticação de usuários
- Validação de dados (CPF, email, senha)
- Perfis diferenciados (cliente/administrador)
- Edição de informações pessoais

### Gestão de Pets
- Cadastro completo dos pets
- Histórico de atendimentos
- Informações detalhadas (espécie, raça, idade)
- Upload de fotos

### Agendamentos
- Marcação de consultas e serviços
- Seleção de horários disponíveis
- Histórico de agendamentos
- Notificações de confirmação

### Loja Virtual
- Catálogo de produtos
- Carrinho de compras
- Controle de estoque
- Sistema de pagamento
- Histórico de pedidos

  Home
  ![Home](https://i.imgur.com/CXNqB3d.png)
  Dashboard
  ![Dashboard](https://i.imgur.com/fnUsaVA.png)
  Loja
  ![Loja](https://i.imgur.com/ARWqMzg.png)
  Pedido Confirmado
  ![PedidoConfirmado](https://i.imgur.com/mBzlYw0.png)
  Serviços
  ![Servicos](https://i.imgur.com/M9761X0.png)
  Minha Conta
  ![MinhaConta](https://i.imgur.com/Jpbcgvp.png)
  Meus Pets
  ![MeusPets](https://i.imgur.com/db9bNyg.png)
  Agendamentos
  ![Agendamentos](https://i.imgur.com/db9bNyg.png)
  

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express
- TypeScript
- MySQL com Sequelize
- JWT para autenticação
- Bcrypt para criptografia
- Jest para testes
- Dotenv para variáveis de ambiente

### Frontend
- React
- TypeScript
- Vite
- Context API
- React Router
- Axios
- Lucide React para ícones
- CSS Modules

## Requisitos do Sistema

- Node.js 18+
- MySQL 8+
- NPM ou Yarn

## Como Executar o Projeto sem Docker

1. Clone o repositório
```bash
git clone https://github.com/LucasSC98/Pet-Working.git
```

2. Instale as dependências (Backend)
```bash
cd backend
npm install
```

3. Instale as dependências (Frontend)
```bash
cd frontend
npm install
```

4. Configure o banco de dados
```bash
# Crie um arquivo .env na pasta backend com as seguintes variáveis
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua-senha
DB_NAME=petworking
```

5. Inicie o servidor backend
```bash
npm run dev
```

6. Inicie o servidor frontend
```bash
cd frontend
npm run dev
```

 ## Como Executar o Projeto com Docker
 
````bash
 docker compose up -d --build    
 ````


## Funcionalidades em Destaque

### Autenticação Segura
- Implementação de JWT
- Senhas criptografadas
- Validação de tokens

### Gestão de Estoque
- Controle automático
- Alertas de estoque baixo
- Histórico de movimentações

### Sistema de Pagamento
- Integração com gateways
- Múltiplas formas de pagamento
- Histórico de transações

### Interface Responsiva
- Design adaptável
- UX otimizada
- Compatível com dispositivos móveis

## Testes

O projeto inclui testes unitários e de integração:

```bash
# Executar testes
npm test
````

## Autores
````bash
Lucas Custódio
João Gustavo
````
