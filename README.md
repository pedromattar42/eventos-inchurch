# EventosInchurch

Sistema de gerenciamento de eventos desenvolvido em Angular com design responsivo e interface moderna.

## Tecnologias Utilizadas

### **Frontend**
- **Angular 19.2.5** - Framework principal
- **TypeScript** - Linguagem de programação
- **PrimeNG** - Biblioteca de componentes UI
- **PrimeIcons** - Ícones
- **SCSS** - Pré-processador CSS
- **Angular Signals** - Gerenciamento de estado reativo
- **RxJS** - Programação reativa

### **Backend (Simulado)**
- **JSON Server** - API REST fake para desenvolvimento
- **db.json** - Banco de dados simulado

### **Ferramentas de Desenvolvimento**
- **Angular CLI** - Ferramenta de linha de comando
- **Karma + Jasmine** - Testes unitários
- **TypeScript Compiler** - Compilação
- **Angular DevKit** - Ferramentas de build

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** - Versão 18.19.0 ou superior
- **npm** - Versão 9.0.0 ou superior (incluído com Node.js)

Para verificar as versões instaladas:
```bash
node --version
npm --version
```

## Funcionalidades

- **Listagem de Eventos** - Grid responsivo com paginação
- **Criação de Eventos** - Formulário completo com validação
- **Edição de Eventos** - Atualização de dados existentes
- **Exclusão de Eventos** - Modal de confirmação
- **Busca de Eventos** - Filtro por título em tempo real
- **Visualização Responsiva** - Cards e lista adaptáveis
- **Feedback Visual** - Toasts de sucesso/erro
- **Loading States** - Indicadores de carregamento
- **Navegação** - Roteamento entre páginas

## Instruções para Execução

### **1. Clone do Repositório**
```bash
git clone <link-do-repositório>
cd eventos-inchurch
```

### **2. Instalação de Dependências**
```bash
npm install
```

### **3. Iniciar a API Fake**
Em um terminal, execute:
```bash
npm run server
```
O servidor JSON rodará em `http://localhost:3000`.

### **4. Executar a Aplicação**
Em outro terminal, execute:
```bash
npm start
```
Acesse a aplicação em `http://localhost:4200`.

## Uso da Aplicação

### **Página Inicial**
- Visualize todos os eventos em formato de cards ou lista
- Use a barra de busca para filtrar eventos
- Navegue entre páginas usando a paginação
- Clique em "Novo Evento" para criar um evento

### **Criar Evento**
- Preencha o título (obrigatório)
- Adicione uma descrição (obrigatório)
- Insira URL da imagem (opcional)
- Marque se possui ingressos ativos
- Clique em "Criar Evento"

### **Editar Evento**
- Clique no ícone de edição no card do evento
- Modifique os campos desejados
- Clique em "Salvar" para confirmar

### **Excluir Evento**
- Clique no ícone de lixeira no card do evento
- Confirme a exclusão no modal

## Design System

### **Atomic Design**
O projeto segue a metodologia Atomic Design:
- **Atoms**: Componentes básicos (input-field, etc.)
- **Molecules**: Combinações simples (event-card, paginator)
- **Organisms**: Componentes complexos (event-form, events-grid)

### **Cores Principais**
- **Primary**: `#8bc34a` (Verde)
- **Secondary**: `#6c757d` (Cinza)
- **Success**: `#28a745` (Verde escuro)
- **Error**: `#dc3545` (Vermelho)

## Scripts Disponíveis

```bash
npm start          # Inicia a aplicação (ng serve)
npm run build      # Build de produção
npm run server     # Inicia JSON Server
npm test           # Executa testes unitários
npm run lint       # Verifica código com ESLint
```

## Comandos de Desenvolvimento

### **Gerar Componentes**
```bash
ng generate component nome-do-componente
ng generate service nome-do-servico
ng generate interface nome-da-interface
```

### **Build de Produção**
```bash
ng build --configuration production
```

### **Testes**
```bash
ng test                    # Testes unitários
ng test --watch=false      # Testes sem watch mode
ng test --code-coverage    # Testes com cobertura
```

## API Endpoints

O JSON Server simula os seguintes endpoints:

```
GET    /events           # Lista todos os eventos
GET    /events/:id       # Busca evento por ID
POST   /events           # Cria novo evento
PUT    /events/:id       # Atualiza evento
DELETE /events/:id       # Remove evento
```

## Responsividade

### **Breakpoints**
- **Mobile**: `< 576px`
- **Tablet**: `576px - 768px`
- **Desktop**: `> 768px`

### **Adaptações**
- Grid responsivo (1-3 colunas)
- Navegação mobile-friendly
- Formulários otimizados para touch
- Cards adaptáveis

## Deploy

### **Build de Produção**
```bash
npm run build
```

### **Servir Localmente**
```bash
npx http-server dist/eventos-inchurch
```

## Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração.

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

Desenvolvido usando Angular 19
