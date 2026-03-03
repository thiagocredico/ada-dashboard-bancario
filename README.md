# Dashboard Bancário (SPA Angular)

Projeto desenvolvido para o curso de Angular da plataforma de educação **Ada** (anteriormente **Let's Code**), com foco em arquitetura, componentização e boas práticas de desenvolvimento frontend.

## Contexto acadêmico

Este repositório atende ao enunciado do projeto **Dashboard Bancário**, proposto no curso, contemplando:

- SPA em Angular sem uso de Angular Router
- Navegação por renderização condicional (`@switch`)
- Consumo de API com `HttpClient` e `Observables`
- Estado compartilhado com `BehaviorSubject`
- Formulários reativos e validações
- Separação de responsabilidades entre componentes e serviços

## Funcionalidades implementadas

- Dashboard com saldo atual, receitas, despesas e últimas transações
- Extrato dinâmico com listagem, ordenação, criação, edição e exclusão de transações
- Transferência com validação de campos obrigatórios, valor positivo e saldo suficiente
- Simulador de crédito/empréstimo com cálculo de parcelas e total em service
- Atualização reativa de saldo e transações entre múltiplas telas

## Requisitos

- Node.js 18+
- npm 9+

## Como executar

1. Instale dependências do frontend:

```bash
cd taskflow
npm install
```

2. Instale dependências da API mock:

```bash
cd ../api
npm install
```

3. Inicie a API (`json-server`):

```bash
cd ../api
npx json-server --watch db.json --port 3000
```

4. Em outro terminal, inicie o frontend:

```bash
cd ../taskflow
ng serve
```

5. Acesse:

- Frontend: http://localhost:4200
- API: http://localhost:3000

## Arquitetura (resumo)

- `core/services/account-state.service.ts`: estado compartilhado (`BehaviorSubject`) e sincronização de saldo/transações.
- `main-panel/pages/*`: organização por features (Dashboard, Extrato, Transferência, Crédito).
- `main-panel/pages/**/services`: regras de consumo HTTP com `HttpClient`.
- `router.service.ts`: controle de navegação da SPA via estado.

## Testes

Executar testes unitários:

```bash
cd taskflow
ng test
```
