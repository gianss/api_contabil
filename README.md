# Projeto de Gerenciamento de Agendamentos, Contas a Pagar e Contas a Receber

Este é um projeto de software desenvolvido para facilitar o gerenciamento de agendamentos, contas a pagar e contas a receber. Ele oferece uma maneira conveniente de agendar compromissos, acompanhar pagamentos e receber pagamentos de clientes.

## Comandos de Start

Para iniciar o projeto, siga os seguintes passos:

1. Certifique-se de ter o Docker instalado em seu ambiente.

2. Execute o seguinte comando na raiz do projeto:

   ```bash
   docker-compose up -d
   ```

   Este comando irá iniciar os contêineres necessários em segundo plano.

3. Em seguida, execute as migrações do banco de dados utilizando o Knex com o seguinte comando:

   ```bash
   npm run knex migrate:latest
   ```

   Este comando irá aplicar as migrações necessárias para criar as tabelas do banco de dados.

4. Após as migrações, execute o comando para popular o banco de dados com dados iniciais (se houver):

   ```bash
   npm run knex seed:run
   ```

   Isso irá inserir dados de seed, se disponíveis, para preencher o banco de dados com informações básicas.

## Testes

Para executar os testes do projeto, você pode usar os seguintes comandos:

- Testes Unitários:

  ```bash
  npm run test:unit
  ```

- Testes de Integração:

  ```bash
  npm run test:integration
  ```

- Testes de Todos os Arquivos Modificados (Staged):

  ```bash
  npm run test:staged
  ```

- Testes para Ambiente de Integração Contínua (CI) com cobertura:

  ```bash
  npm run test:ci
  ```