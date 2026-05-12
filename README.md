# Lynflow — AI Productivity Dashboard

<p align="center">
  <img src="./src/assets/preview.gif" alt="Lynflow Preview" width="100%" />
</p>

<p align="center">
  <strong>Dashboard moderno de produtividade com tarefas, metas, métricas, tema dark/light e insights simulados por IA.</strong>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-layout">Layout</a> •
  <a href="#-como-rodar">Como rodar</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 📌 Sobre o projeto

O **Lynflow** é um dashboard de produtividade desenvolvido com **React**, **TypeScript**, **Vite** e **Tailwind CSS**.

A proposta do projeto é simular um produto SaaS moderno, inspirado visualmente em ferramentas como **Linear**, **Notion**, **Trello** e **Stripe Dashboard**.

O app permite organizar tarefas, acompanhar produtividade, visualizar metas, alternar entre tema dark/light e receber insights simulados de IA para ajudar na priorização da rotina.

Este projeto foi criado com foco em portfólio front-end, demonstrando:

- organização de código;
- componentização;
- rotas protegidas;
- persistência local;
- UI moderna;
- responsividade;
- manipulação de estado;
- arquitetura de pastas;
- visão de produto.

---

## 🚀 Demo

> Adicione aqui o link do deploy quando publicar na Vercel.

```txt

```

---

## 🖼️ Layout

### Landing Page

<p align="center">
  <img src="./src/assets/landing-preview.png" alt="Landing Page Preview" width="100%" />
</p>

### Dashboard

<p align="center">
  <img src="./src/assets/dashboard-preview.png" alt="Dashboard Preview" width="100%" />
</p>

### Tasks

<p align="center">
  <img src="./src/assets/tasks-preview.png" alt="Tasks Preview" width="100%" />
</p>

> Caso as imagens ainda não apareçam, adicione os prints dentro da pasta `src/assets`.

---

## ✨ Funcionalidades

### Landing Page

- Hero section com chamada principal;
- apresentação do produto;
- cards de benefícios;
- preview visual do dashboard;
- roadmap;
- CTA para cadastro;
- footer institucional.

### Autenticação local

- Cadastro de usuário;
- login;
- logout;
- sessão persistente;
- rotas protegidas;
- dados salvos no `localStorage`.

### Dashboard

- cards de métricas;
- produtividade atual;
- tarefas concluídas;
- tarefas pendentes;
- tarefas de alta prioridade;
- gráfico de produtividade semanal;
- resumo geral;
- painel de insights.

### Sistema de tarefas

- criar tarefa;
- editar tarefa;
- concluir tarefa;
- excluir tarefa;
- filtrar por status;
- definir prioridade;
- definir categoria;
- persistência local.

### Página de metas

- progresso do MVP;
- metas semanais;
- tarefas concluídas;
- pendências;
- plano de evolução.

### IA Insights

- simulação de análise inteligente;
- sugestão baseada nas tarefas;
- análise de produtividade;
- destaque para prioridades;
- base pronta para futura integração com API real.

### Settings

- dados da conta local;
- alternância entre tema dark e light;
- limpar tarefas;
- logout.

### Tema

- dark mode;
- light mode;
- persistência no navegador;
- variáveis CSS globais;
- design system inicial.

---

## 🧠 Objetivo técnico

O objetivo do Lynflow é demonstrar domínio em front-end moderno através de um projeto com aparência e estrutura de produto real.

O projeto demonstra:

- React com TypeScript;
- arquitetura organizada;
- criação de hooks customizados;
- controle de estado;
- uso de rotas;
- layout responsivo;
- persistência com `localStorage`;
- gráficos;
- animações;
- acessibilidade básica;
- estilização escalável com Tailwind e CSS variables.

---

## 🛠️ Tecnologias

As principais tecnologias utilizadas foram:

| Tecnologia | Uso |
|---|---|
| React | Construção da interface |
| TypeScript | Tipagem e segurança no código |
| Vite | Ambiente de desenvolvimento |
| Tailwind CSS | Estilização |
| React Router DOM | Rotas da aplicação |
| Framer Motion | Animações |
| Recharts | Gráficos |
| Lucide React | Ícones |
| LocalStorage | Persistência local |
| CSS Variables | Sistema de tema |

---

## 📦 Bibliotecas utilizadas

```bash
react
react-dom
typescript
vite
@vitejs/plugin-react
tailwindcss
@tailwindcss/vite
react-router-dom
framer-motion
recharts
lucide-react
```

---

## 📁 Estrutura de pastas

```txt
src/
 ├── assets/
 │   ├── preview.png
 │   ├── landing-preview.png
 │   ├── dashboard-preview.png
 │   └── tasks-preview.png
 │
 ├── components/
 │   ├── ThemeProvider.tsx
 │   └── ThemeToggle.tsx
 │
 ├── hooks/
 │   ├── useTasks.ts
 │   └── useTheme.ts
 │
 ├── layouts/
 │   └── AppLayout.tsx
 │
 ├── pages/
 │   ├── Dashboard.tsx
 │   ├── Goals.tsx
 │   ├── Insights.tsx
 │   ├── Landing.tsx
 │   ├── Settings.tsx
 │   ├── Tasks.tsx
 │   └── auth/
 │       ├── Login.tsx
 │       └── Register.tsx
 │
 ├── routes/
 │   └── ProtectedRoute.tsx
 │
 ├── services/
 │   └── auth.ts
 │
 ├── store/
 │
 ├── styles/
 │
 ├── types/
 │   └── task.ts
 │
 ├── utils/
 │
 ├── App.tsx
 ├── index.css
 └── main.tsx
```

---

## 🧩 Arquitetura

O projeto foi separado por responsabilidade:

### `components/`

Componentes reutilizáveis da aplicação.

Exemplos:

- `ThemeToggle`
- `ThemeProvider`

### `hooks/`

Hooks customizados para lógica reutilizável.

Exemplos:

- `useTasks`
- `useTheme`

### `layouts/`

Estruturas visuais compartilhadas entre páginas logadas.

Exemplo:

- sidebar;
- navegação mobile;
- área principal do app.

### `pages/`

Páginas principais da aplicação.

Exemplos:

- Landing;
- Login;
- Register;
- Dashboard;
- Tasks;
- Goals;
- Insights;
- Settings.

### `services/`

Funções de serviço, como autenticação local.

### `routes/`

Controle de rotas protegidas.

### `types/`

Tipagens globais usadas no projeto.

---

## 🔐 Autenticação

Na versão atual, o Lynflow usa uma autenticação local com `localStorage`.

Essa abordagem foi escolhida para o MVP inicial, permitindo testar rapidamente:

- fluxo de cadastro;
- login;
- sessão persistente;
- logout;
- rotas privadas.

### Chaves usadas no localStorage

```txt
lynflow-users
lynflow-session
lynflow-tasks
lynflow-theme
```

### Futuramente

A autenticação local poderá ser substituída por:

- Supabase Auth;
- Firebase Auth;
- Auth.js;
- backend próprio.

---

## 📊 Sistema de tarefas

Cada tarefa possui:

```ts
type Task = {
  id: string
  title: string
  category: string
  priority: "low" | "medium" | "high"
  done: boolean
  createdAt: string
}
```

O usuário pode:

- criar novas tarefas;
- editar o título;
- marcar como concluída;
- excluir;
- filtrar por status;
- classificar por prioridade;
- separar por categoria.

---

## 🎨 Sistema de tema

O projeto possui suporte a:

- tema escuro;
- tema claro;
- persistência do tema no navegador;
- variáveis CSS globais.

O tema é aplicado através do atributo:

```html
<html data-theme="dark">
```

ou:

```html
<html data-theme="light">
```

As cores principais são controladas no arquivo:

```txt
src/index.css
```ç

---

## 📱 Responsividade

O Lynflow foi desenvolvido para funcionar em:

- desktop;
- tablet;
- mobile.

No desktop, o app utiliza sidebar lateral.

No mobile, a navegação principal passa para uma barra fixa inferior.

---

## 🧪 Como rodar o projeto

### Pré-requisitos

Antes de começar, você precisa ter instalado:

- Node.js;
- npm;
- Git.

---

### 1. Clone o repositório

```bash
git clone https://github.com/Lynsz/fluxo-de-lince.git
```

---

### 2. Entre na pasta do projeto

```bash
cd fluxo-de-lince
```

---

### 3. Instale as dependências

```bash
npm install
```

---

### 4. Rode o projeto localmente

```bash
npm run dev
```

---

### 5. Acesse no navegador

```txt
http://localhost:5173
```

---

## 🧱 Scripts disponíveis

| Comando | Função |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Visualiza a build localmente |
| `npm run lint` | Executa verificação de lint, se configurado |

---

## 🌐 Deploy

O deploy pode ser feito na Vercel.

Configuração recomendada:

```txt
Framework: Vite
Build command: npm run build
Output directory: dist
```

---

## 🗺️ Roadmap

### Fase 1 — MVP

- [x] Setup com React, TypeScript e Vite
- [x] Configuração do Tailwind CSS
- [x] Estrutura de pastas
- [x] Landing Page
- [x] Login local
- [x] Cadastro local
- [x] Rotas protegidas
- [x] Layout com sidebar
- [x] Dashboard
- [x] Página de tarefas
- [x] Página de metas
- [x] Página de insights
- [x] Página de configurações
- [x] Tema dark/light
- [x] Persistência com localStorage
- [x] Responsividade

---

### Fase 2 — Melhorias visuais

- [ ] Criar componentes reutilizáveis de UI
- [ ] Adicionar skeleton loading
- [ ] Adicionar toast notifications
- [ ] Melhorar estados vazios
- [ ] Melhorar animações entre páginas
- [ ] Criar modais reutilizáveis
- [ ] Melhorar acessibilidade

---

### Fase 3 — Funcionalidades avançadas

- [ ] Drag and drop de tarefas
- [ ] Calendário
- [ ] Notificações
- [ ] Perfil de usuário
- [ ] Analytics avançado
- [ ] Filtros por categoria
- [ ] Busca de tarefas
- [ ] Ordenação por prioridade

---

### Fase 4 — Integrações reais

- [ ] Supabase Auth
- [ ] Banco de dados Supabase
- [ ] API de IA
- [ ] Integração com OpenAI ou Gemini
- [ ] Deploy na Vercel
- [ ] Testes automatizados

---

## 🤖 Possíveis integrações com IA

No MVP atual, os insights são simulados localmente.

No futuro, a aplicação poderá consumir uma API de IA para:

- resumir tarefas;
- sugerir prioridades;
- organizar agenda;
- gerar rotina diária;
- criar plano semanal;
- sugerir metas;
- analisar produtividade.

Exemplo de fluxo futuro:

```txt
Tarefas do usuário → API de IA → Sugestões personalizadas → Dashboard
```

---

## 💼 Valor para portfólio

Este projeto foi pensado para demonstrar habilidades valorizadas em vagas front-end júnior:

- construção de interface moderna;
- organização de projeto;
- rotas protegidas;
- autenticação simulada;
- persistência local;
- gráficos;
- tema dark/light;
- responsividade;
- componentização;
- TypeScript;
- lógica de produto;
- boas práticas visuais.

---

## 🧾 Padrão de commits

Exemplos de commits usados no desenvolvimento:

```bash
feat: add landing page
feat: create local auth system
feat: add protected routes
feat: add dashboard metrics
feat: create task management page
feat: add dark and light theme
style: improve responsive sidebar
style: polish dashboard UI
fix: add accessible labels to inputs
docs: add professional README
```

---

## 🌿 Sugestão de branches

```txt
main
develop
feature/auth
feature/dashboard
feature/tasks
feature/theme
feature/landing-page
feature/readme
```

---

## 📌 Melhorias técnicas futuras

Algumas melhorias planejadas para elevar o nível técnico do projeto:

- separar botões em componente reutilizável;
- criar componente `PageHeader`;
- criar componente `MetricCard`;
- criar componente `TaskCard`;
- criar componente `EmptyState`;
- criar componente `Input`;
- criar contexto global de usuário;
- adicionar tratamento de erros;
- adicionar loading states;
- adicionar testes;
- conectar com backend real;
- melhorar SEO da Landing Page.

---

## 👩‍💻 Desenvolvedora

Desenvolvido por **Kethelyn Carvalho**.

Projeto criado como parte da construção de portfólio para área de **Desenvolvimento Front-End**.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## ✅ Status do projeto

```txt
MVP funcional em desenvolvimento.
```

Versão atual:

```txt
Landing Page + Auth Local + Dashboard + Tasks + Goals + AI Insights + Settings + Dark/Light Theme
```