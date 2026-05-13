# Lynflow — AI Productivity Dashboard

<p align="center">
  <img src="./src/assets/preview.gif" alt="Lynflow Preview" width="100%" />
</p>

<p align="center">
  <strong>Dashboard de produtividade com tarefas, analytics, histórico, atalhos, onboarding e experiência SaaS.</strong>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-rodar">Como rodar</a> •
  <a href="#-deploy">Deploy</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 📌 Sobre o projeto

O **Lynflow** é um dashboard de produtividade desenvolvido com foco em experiência de usuário, organização pessoal e apresentação profissional para portfólio front-end.

O projeto simula um produto SaaS moderno, com autenticação local, rotas protegidas, gerenciamento de tarefas, métricas, gráficos, histórico de atividades, tema claro/escuro, onboarding, command palette e atalhos de teclado.

A proposta principal é demonstrar domínio em:

- React com TypeScript;
- componentização;
- estado global;
- persistência local;
- rotas protegidas;
- UI responsiva;
- experiência de produto;
- arquitetura front-end escalável.

---

## 🚀 Demonstração

> Adicione aqui o link depois do deploy na Vercel.

```txt
https://lynflow.vercel.app/s
```

---

## 🖼️ Preview

### Landing Page

<p align="center">
  <img src="./src/assets/landing-preview.png" alt="Lynflow Landing Page" width="100%" />
</p>

### Dashboard

<p align="center">
  <img src="./src/assets/dashboard-preview.png" alt="Lynflow Dashboard" width="100%" />
</p>

### Tasks

<p align="center">
  <img src="./src/assets/tasks-preview.png" alt="Lynflow Tasks" width="100%" />
</p>

### Activity

<p align="center">
  <img src="./src/assets/activity-preview.png" alt="Lynflow Activity" width="100%" />
</p>

---

## ✨ Funcionalidades

### Autenticação local

- Cadastro de usuário.
- Login local.
- Logout.
- Rotas protegidas.
- Edição de perfil.
- Sessão salva no navegador.

### Dashboard

- Métricas de produtividade.
- Tarefas concluídas.
- Tarefas pendentes.
- Tarefas de alta prioridade.
- Gráfico de produtividade semanal.
- Gráfico por prioridade.
- Gráfico por categoria.
- Análise rápida automática.
- Feed de atividade recente.

### Tasks

- Criar tarefas.
- Editar tarefas.
- Deletar tarefas com confirmação.
- Marcar tarefas como concluídas.
- Reabrir tarefas.
- Categorizar tarefas.
- Definir prioridade.
- Buscar tarefas.
- Filtrar por status.
- Filtrar por prioridade.
- Filtrar por categoria.
- Ordenar por data, prioridade, título ou ordem manual.
- Reordenar com drag and drop.
- Persistência local com `localStorage`.

### Goals

- Visualização de metas do MVP.
- Progresso geral.
- Resumo técnico.
- Plano semanal.

### AI Insights

- Sugestões simuladas com base nas tarefas.
- Análise de produtividade.
- Priorização de ações.
- Recomendações para evolução do projeto.

### Activity

- Histórico completo de ações.
- Registro de tarefa criada.
- Registro de tarefa concluída.
- Registro de tarefa reaberta.
- Registro de tarefa deletada.
- Registro de reordenação.
- Registro de limpeza de tarefas.
- Registro de restauração da demo.
- Busca no histórico.
- Filtro por tipo de atividade.
- Ordenação por data.
- Limpeza do histórico com confirmação.

### Profile

- Dados da conta local.
- Avatar com iniciais.
- Edição de nome e e-mail.
- Métricas pessoais.
- Categorias usadas.
- Atalhos rápidos para Dashboard, Tasks e Goals.

### Settings

- Alternância entre tema claro e escuro.
- Controle de dados locais.
- Restaurar tarefas demo.
- Limpar tarefas.
- Limpar histórico.
- Reabrir onboarding.
- Checklist pré-deploy.
- Guia de deploy.
- Logout.

### Experiência de produto

- Tema dark/light.
- Skeleton loading.
- Toast notifications.
- Modal de confirmação.
- Onboarding inicial.
- Command Palette com `Ctrl + K`.
- Atalhos globais de navegação.
- Página 404 personalizada.
- Error Boundary.
- Layout responsivo.
- Menu mobile com More Menu.

---

## ⌨️ Atalhos de teclado

| Atalho | Ação |
|---|---|
| `Ctrl + K` | Abrir Command Palette |
| `G` + `D` | Ir para Dashboard |
| `G` + `T` | Ir para Tasks |
| `G` + `G` | Ir para Goals |
| `G` + `I` | Ir para AI Insights |
| `G` + `A` | Ir para Activity |
| `G` + `P` | Ir para Profile |
| `G` + `S` | Ir para Settings |
| `N` | Ir para Tasks e focar no campo de nova tarefa |
| `Esc` | Fechar overlays/modais |

---

## 🛠️ Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion
- Recharts
- Lucide React
- DnD Kit
- LocalStorage

---

## 📦 Bibliotecas principais

| Biblioteca | Uso |
|---|---|
| `react-router-dom` | Rotas e navegação |
| `framer-motion` | Animações e transições |
| `recharts` | Gráficos do Dashboard |
| `lucide-react` | Ícones |
| `@dnd-kit/core` | Drag and drop |
| `@dnd-kit/sortable` | Ordenação manual das tarefas |
| `@dnd-kit/utilities` | Transformações do drag and drop |
| `tailwindcss` | Estilização |

---

## 🧱 Arquitetura

```txt
src/
├── assets/
├── components/
│   ├── auth/
│   ├── public/
│   ├── settings/
│   ├── skeletons/
│   ├── tasks/
│   └── ui/
├── hooks/
├── layouts/
├── pages/
│   └── auth/
├── routes/
├── services/
├── store/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

---

## 🧩 Padrões usados

### Componentização

O projeto foi dividido em componentes reutilizáveis, como:

- `Button`
- `Input`
- `SectionCard`
- `MetricCard`
- `PageHeader`
- `ProgressBar`
- `ConfirmDialog`
- `ToastProvider`
- `CommandPalette`
- `OnboardingModal`
- `DeployChecklist`
- `DeployGuide`

### Estado global

As tarefas e atividades são centralizadas com Context API:

```txt
TasksProvider
↓
useTasks()
↓
Dashboard, Tasks, Goals, Insights, Activity, Profile, Settings
```

### Persistência local

O projeto usa `localStorage` para salvar:

- usuários;
- sessão;
- tarefas;
- atividades;
- tema;
- onboarding;
- checklist pré-deploy.

### Rotas protegidas

Páginas internas só podem ser acessadas com sessão local ativa.

```txt
ProtectedRoute
↓
AppLayout
↓
Página protegida
```

---

## 🔐 Autenticação local

O Lynflow possui autenticação simulada usando `localStorage`.

Esse modelo foi escolhido para manter o projeto simples, fácil de testar e focado em front-end.

Funcionalidades:

- cadastro;
- login;
- logout;
- sessão persistente;
- edição de perfil;
- proteção de rotas.

> Observação: por ser um projeto de portfólio front-end, as senhas ficam apenas em ambiente local de demonstração. Em produção real, o correto seria usar backend, Supabase, Firebase Auth, Auth.js ou outro serviço seguro.

---

## 📊 Analytics

O Dashboard calcula dados reais a partir das tarefas salvas:

- produtividade geral;
- tarefas concluídas;
- tarefas pendentes;
- tarefas de alta prioridade;
- produtividade por dia;
- tarefas por categoria;
- distribuição por prioridade;
- categoria dominante;
- status produtivo.

---

## 📱 Responsividade

O layout foi ajustado para:

- 320px;
- 375px;
- 430px;
- tablets;
- notebooks;
- desktops;
- telas grandes.

No mobile, a navegação usa menu inferior com:

```txt
Home | Tasks | Activity | Profile | More
```

As páginas secundárias ficam dentro do botão **More**:

```txt
Goals
AI Insights
Settings
Sair da conta
```

---

## 🧪 Como rodar

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/lynflow.git
```

Entre na pasta:

```bash
cd lynflow
```

Instale as dependências:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:5173
```

---

## 🏗️ Build

Para gerar a versão de produção:

```bash
npm run build
```

Para testar localmente o build:

```bash
npm run preview
```

---

## 🚀 Deploy

O Lynflow está preparado para deploy na Vercel.

### Configuração usada

O projeto possui um arquivo `vercel.json` na raiz para configurar build, pasta de saída e suporte a rotas internas com React Router.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Configuração esperada na Vercel

| Campo | Valor |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Como publicar

1. Faça push do projeto para o GitHub.
2. Acesse a Vercel.
3. Clique em **Add New Project**.
4. Importe o repositório do Lynflow.
5. Confirme se o framework detectado é **Vite**.
6. Confirme:
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Clique em **Deploy**.
8. Teste a URL gerada.

### Rotas para testar depois do deploy

```txt
/
 /login
 /register
 /dashboard
 /tasks
 /goals
 /insights
 /activity
 /profile
 /settings
 /qualquer-rota
```

As rotas internas funcionam no deploy por causa do `rewrites` configurado no `vercel.json`.

### Comandos finais

```bash
npm run build
```

```bash
git add .
git commit -m "chore: configure vercel deploy"
git push
```
---

## ✅ Checklist pré-deploy

- [ ] Build sem erros.
- [ ] Login testado.
- [ ] Cadastro testado.
- [ ] Dashboard testado.
- [ ] Tasks testado.
- [ ] Drag and drop testado.
- [ ] Activity testado.
- [ ] Profile testado.
- [ ] Settings testado.
- [ ] Página 404 testada.
- [ ] Responsividade revisada.
- [ ] Prints adicionados.
- [ ] README atualizado.
- [ ] Deploy publicado.
- [ ] Link adicionado ao GitHub.
- [ ] Link adicionado ao LinkedIn.

---

## 🧠 Decisões técnicas

### Por que `localStorage`?

Para manter o projeto simples, rápido e focado no front-end. O objetivo é demonstrar interface, experiência, arquitetura, estado global e persistência local.

### Por que Context API?

Porque o app possui múltiplas páginas consumindo os mesmos dados. Centralizar tarefas e atividades evita inconsistência entre telas.

### Por que DnD Kit?

Porque é uma solução moderna, flexível e adequada para drag and drop em React.

### Por que Recharts?

Porque permite criar gráficos simples e funcionais com boa integração em React.

### Por que Command Palette?

Porque melhora a experiência de produto e aproxima o projeto de aplicações SaaS modernas.

---

## 🧭 Roadmap

### Concluído

- [x] Landing page
- [x] Login
- [x] Cadastro
- [x] Rotas protegidas
- [x] Dashboard
- [x] Tasks
- [x] Goals
- [x] AI Insights
- [x] Activity
- [x] Profile
- [x] Settings
- [x] Tema claro/escuro
- [x] Toast notifications
- [x] Modal de confirmação
- [x] Skeleton loading
- [x] Drag and drop
- [x] Histórico de atividades
- [x] Command Palette
- [x] Atalhos globais
- [x] Onboarding
- [x] Página 404
- [x] Error Boundary
- [x] Checklist pré-deploy
- [x] Guia de deploy

### Melhorias futuras

- [ ] Integração real com Supabase.
- [ ] Autenticação real.
- [ ] Banco de dados remoto.
- [ ] Tarefas com data de vencimento.
- [ ] Kanban view.
- [ ] Calendário.
- [ ] Exportar dados.
- [ ] Integração com IA real.
- [ ] Testes automatizados.
- [ ] PWA.
- [ ] Notificações.
- [ ] Multiusuário.

---

## 🧾 Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Roda o projeto em desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Visualiza o build localmente |
| `npm run lint` | Roda lint, caso configurado |

---

## 👩‍💻 Desenvolvedora

Desenvolvido por **Kethelyn Carvalho**.

Projeto criado com foco em portfólio front-end, aprendizado prático e evolução profissional na área de desenvolvimento.

---

## 📄 Licença

Este projeto está sob licença MIT.

---

## ⭐ Status

```txt
Status: Finalizando pré-deploy
Versão: MVP portfolio-ready
```

---

## 📸 Imagens necessárias

Coloque estes arquivos dentro de:

```txt
src/assets/
```

Com estes nomes:

```txt
preview.png
landing-preview.png
dashboard-preview.png
tasks-preview.png
activity-preview.png
```

Caso queira usar um GIF como preview principal, substitua:

```md
<img src="./src/assets/preview.png" alt="Lynflow Preview" width="100%" />
```

por:

```md
<img src="./src/assets/preview.gif" alt="Lynflow Preview" width="100%" />
```

---

## 🧱 Commit recomendado

```bash
git add .
git commit -m "docs: add final Lynflow README"
git push
```