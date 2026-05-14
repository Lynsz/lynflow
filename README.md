# Lynflow — AI Productivity Dashboard

<p align="center">
  <img src="./src/assets/preview.gif" alt="Lynflow Preview" width="100%" />
</p>

<p align="center">
  <strong>Dashboard de produtividade moderno com tarefas, calendário, analytics, IA opcional, PWA, Supabase opcional e testes automatizados.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Portfolio%20Ready-14B8A6?style=for-the-badge" alt="Project Status" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=ffffff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=ffffff" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-UI-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=ffffff" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Optional-3FCF8E?style=for-the-badge&logo=supabase&logoColor=ffffff" alt="Supabase" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=ffffff" alt="PWA" />
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-demonstração">Demonstração</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-como-rodar">Como rodar</a> •
  <a href="#-testes">Testes</a> •
  <a href="#-deploy">Deploy</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 📌 Sobre o projeto

O **Lynflow** é um dashboard de produtividade desenvolvido como projeto de portfólio front-end, com foco em experiência de produto, organização pessoal, arquitetura escalável e qualidade técnica.

A proposta é simular um produto SaaS moderno, com autenticação, tarefas, calendário, analytics, notificações, tema claro/escuro, PWA, testes automatizados, integração opcional com Supabase e estrutura preparada para IA real via rota segura no servidor.

O projeto demonstra domínio em:

- React com TypeScript;
- componentização reutilizável;
- estado global com Context API;
- persistência local com `localStorage`;
- backend opcional com Supabase;
- rotas protegidas;
- dashboards analíticos;
- responsividade;
- acessibilidade;
- testes automatizados;
- PWA;
- deploy com Vercel;
- organização de projeto real para portfólio.

---

## 🚀 Demonstração

Acesse o projeto online:

```txt
https://lynflow.vercel.app
```

---

## 🖼️ Preview

### Preview principal

<p align="center">
  <img src="./src/assets/preview.gif" alt="Lynflow Animated Preview" width="100%" />
</p>

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

### Autenticação

- Cadastro de usuário.
- Login.
- Logout.
- Rotas protegidas.
- Sessão persistida no navegador.
- Autenticação local por padrão.
- Autenticação real com Supabase quando configurado.
- Fallback local quando Supabase não está configurado.

### Dashboard

- Métricas gerais de produtividade.
- Total de tarefas concluídas.
- Total de tarefas pendentes.
- Total de tarefas de alta prioridade.
- Gráfico de produtividade semanal.
- Gráfico por prioridade.
- Gráfico por categoria.
- Painel de foco com recomendação automática.
- Dashboard por período:
  - últimos 7 dias;
  - últimos 30 dias;
  - últimos 90 dias;
  - todo o histórico.
- Comparação com período anterior.
- Ranking de categorias por período.
- Tarefas recentes do período.
- Leitura automática de evolução.
- Feed de atividade recente.

### Tasks

- Criar tarefas.
- Editar tarefas.
- Deletar tarefas com confirmação.
- Marcar tarefas como concluídas.
- Reabrir tarefas.
- Categorizar tarefas.
- Definir prioridade.
- Definir data de vencimento.
- Definir recorrência:
  - nenhuma;
  - diária;
  - semanal;
  - mensal.
- Reagendar tarefas recorrentes automaticamente.
- Buscar tarefas.
- Filtrar por status.
- Filtrar por tarefas atrasadas.
- Filtrar por prioridade.
- Filtrar por categoria.
- Ordenar por data, prioridade, título ou ordem manual.
- Visualização em lista.
- Visualização Kanban.
- Drag and drop com DnD Kit.
- Preferência de visualização salva no `localStorage`.
- Cards de resumo filtráveis.
- Separação entre tarefas atrasadas, pendentes e concluídas.
- Painel de prazos.
- Painel de insights das tarefas filtradas.
- Limpeza rápida de tarefas concluídas.
- Ações em massa.
- Exportação CSV de todas as tarefas.
- Exportação CSV das tarefas filtradas.
- CSV com coluna de recorrência.

### Calendar

- Visualização mensal das tarefas com vencimento.
- Detalhe das tarefas por dia selecionado.
- Indicadores de prioridade.
- Indicadores de atraso.
- Indicadores de conclusão.
- Indicadores de recorrência.
- Edição rápida de prazo.
- Edição rápida de recorrência.
- Conclusão de tarefas recorrentes com avanço automático para a próxima data.

### Notificações

- Centro de notificações no topo do app.
- Alertas automáticos com base nas tarefas.
- Tarefas atrasadas.
- Tarefas vencendo hoje.
- Tarefas com vencimento próximo.
- Tarefas de alta prioridade sem prazo.
- Painel acessível com `aria-expanded`, `aria-controls` e `aria-live`.
- Fechamento com botão, clique externo e tecla `Esc`.

### Goals

- Página dedicada para metas.
- Métricas do MVP.
- Progresso baseado nas tarefas concluídas.
- Milestones do projeto.
- Diagnóstico automático da saúde da meta.
- Recomendações de próximos passos.
- Plano semanal estruturado.
- Sugestões de evolução do produto.

### AI Insights

- Recomendações baseadas nas tarefas reais.
- Fallback local determinístico.
- Estrutura preparada para IA real opcional.
- Rota serverless segura para chamada de IA.
- Não expõe chave de API no front-end.
- Continua funcionando sem configuração de IA.

### Activity

- Histórico completo de ações.
- Registro de tarefas criadas.
- Registro de tarefas concluídas.
- Registro de tarefas reabertas.
- Registro de tarefas deletadas.
- Registro de reordenação.
- Registro de limpeza de tarefas.
- Registro de restauração da demo.
- Busca no histórico.
- Filtro por tipo de atividade.
- Ordenação por data.
- Limpeza do histórico com confirmação.

### Profile

- Dados da conta.
- Avatar com iniciais.
- Edição de nome e e-mail.
- Métricas pessoais.
- Categorias usadas.
- Status do modo local ou Supabase.
- Status de sincronização.
- Último horário de sincronização.
- Atalhos rápidos para áreas principais.

### Settings

- Alternância entre tema claro e escuro.
- Preview visual de aparência.
- Controle de dados locais.
- Modo de persistência local ou Supabase.
- Status de conexão.
- Status de sincronização.
- Último sync.
- Botão para tentar sincronizar novamente.
- Exportação de backup JSON.
- Importação de backup JSON.
- Restaurar tarefas demo.
- Limpar tarefas.
- Limpar histórico.
- Reabrir onboarding.
- Checklist pré-deploy.
- Guia de deploy.
- Status de PWA.
- Status online/offline.
- Status de instalação do app.
- Logout.

### PWA

- Manifest configurado.
- Service worker registrado em produção.
- Página offline personalizada.
- Cache básico de assets e navegação.
- Status online/offline em Settings.
- Status de instalação do app.
- Botão de instalação quando o navegador permite.

### Experiência de produto

- Tema dark/light.
- Layout responsivo.
- Menu lateral desktop.
- Menu inferior mobile.
- More menu no mobile.
- Toast notifications.
- Modal de confirmação.
- Skeleton loading.
- Onboarding inicial.
- Command Palette com `Ctrl + K`.
- Atalhos globais de navegação.
- Página 404 personalizada.
- Error Boundary.
- SEO básico.
- Preview social.
- Acessibilidade com skip link, landmarks, labels e foco visível.

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
| `Esc` | Fechar overlays e modais |

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
- Supabase opcional
- OpenAI API opcional via rota serverless
- LocalStorage
- Vitest
- Testing Library
- Playwright
- GitHub Actions
- PWA
- Vercel

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
| `@supabase/supabase-js` | Autenticação e persistência remota opcional |
| `vitest` | Testes unitários |
| `@testing-library/react` | Testes de componentes |
| `@testing-library/jest-dom` | Matchers de DOM |
| `@playwright/test` | Testes end-to-end |
| `tailwindcss` | Estilização |
| OpenAI Responses API | IA real opcional no servidor |

---

## 🧱 Arquitetura

```txt
src/
├── assets/
├── components/
│   ├── accessibility/
│   ├── auth/
│   ├── dashboard/
│   ├── notification/
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

### Pastas principais

| Pasta | Responsabilidade |
|---|---|
| `components` | Componentes reutilizáveis de interface |
| `pages` | Telas principais do app |
| `store` | Estado global de tarefas e atividades |
| `hooks` | Hooks customizados |
| `utils` | Regras de negócio e funções testáveis |
| `types` | Tipagens centrais do projeto |
| `services` | Integrações externas |
| `layouts` | Estrutura visual das páginas protegidas |
| `routes` | Proteção e controle de rotas |

---

## 🧩 Padrões usados

### Componentização

Componentes reutilizáveis relevantes:

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
- `TaskNotificationCenter`
- `ThemeToggle`
- `DeployChecklist`
- `DeployGuide`
- `ErrorBoundary`
- `PwaStatus`
- `TaskKanbanBoard`
- `TaskSummaryCards`
- `TaskDeadlineOverview`
- `CompletedTasksCleanup`
- `TaskExportActions`
- `TaskBulkActions`
- `TaskInsightsPanel`
- `DashboardFocusPanel`
- `DashboardPeriodPanel`

### Estado global

As tarefas e atividades são centralizadas com Context API:

```txt
TasksProvider
↓
useTasks()
↓
Dashboard, Tasks, Calendar, Goals, Insights, Activity, Profile, Settings
```

### Persistência local

O projeto usa `localStorage` para salvar:

- usuários locais;
- sessão;
- tarefas;
- atividades;
- tema;
- onboarding;
- checklist pré-deploy;
- preferências de visualização.

### Rotas protegidas

Páginas internas só podem ser acessadas com sessão ativa.

```txt
ProtectedRoute
↓
AppLayout
↓
Página protegida
```

---

## 🔐 Autenticação

O Lynflow possui autenticação local usando `localStorage` e suporte opcional a autenticação real com Supabase.

No modo local, o objetivo é manter o projeto simples, testável e focado no front-end.

No modo Supabase, o projeto pode usar:

- `supabase.auth.signUp`;
- `supabase.auth.signInWithPassword`;
- sessão autenticada;
- tabela `profiles`;
- RLS;
- persistência remota;
- realtime com filtro por usuário.

> Observação: o modo local é demonstrativo para portfólio. Em um produto real, a autenticação deve usar backend seguro.

---

## 🗄️ Backend e persistência

O Lynflow funciona em **modo local por padrão**.

Quando as variáveis do Supabase não existem, o app continua funcionando com `localStorage`.

Para ativar Supabase, configure:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Arquivos relacionados:

```txt
.env.example
supabase/schema.sql
src/services/supabase.ts
src/types/supabase.ts
```

### Multiusuário com Supabase

Quando Supabase está ativo:

- `profiles`, `tasks` e `task_activities` usam `user_id`;
- cada usuário acessa apenas os próprios dados;
- operações remotas filtram pelo usuário atual;
- realtime escuta alterações com filtro por usuário;
- o app mantém fallback local quando Supabase não está configurado.

### Segurança e RLS

O schema do Supabase deve habilitar RLS em:

- `profiles`;
- `tasks`;
- `task_activities`.

As policies devem garantir que usuários autenticados só leiam e alterem os próprios dados.

A `anon key` pode ser usada no front-end. A `service role key` nunca deve ser exposta em variáveis `VITE_*`.

---

## 🔄 Sincronização entre dispositivos

Quando Supabase está ativo, o app usa Realtime para sincronizar dados entre abas e dispositivos.

O status de sincronização diferencia:

- `offline`;
- `local-only`;
- `connecting`;
- `connected`;
- `syncing`;
- `synced`;
- `error`.

Settings exibe:

- modo atual;
- conexão;
- estado de sincronização;
- último sync;
- erro recente;
- sessões/dispositivos conectados;
- botão para tentar sincronizar novamente.

Sem Supabase, o app exibe modo local e mantém o funcionamento completo com `localStorage`.

---

## 🤖 IA opcional

O Lynflow possui estrutura para **AI Insights**.

A integração real é opcional e deve acontecer apenas no servidor, sem expor chave de API no front-end.

Variáveis esperadas:

```env
OPENAI_API_KEY=
AI_PROVIDER=openai
```

Sem configuração de IA, o app usa fallback local baseado nas tarefas reais.

O fallback considera:

- total de tarefas;
- tarefas concluídas;
- tarefas pendentes;
- tarefas atrasadas;
- prioridades;
- categorias;
- vencimentos;
- recorrências.

---

## ♿ Acessibilidade

Melhorias implementadas:

- Skip link para conteúdo principal.
- Landmarks com `main`, `nav`, `header` e labels.
- Foco visível em botões e ações principais.
- Modais com `role="dialog"`.
- `aria-modal`, `aria-labelledby` e `aria-describedby`.
- Fechamento com `Esc`.
- Botões com `aria-label` quando necessário.
- Command Palette com busca acessível.
- Centro de notificações com `aria-expanded`, `aria-controls` e `aria-live`.
- Estados de botões com `aria-pressed`.
- Testes usando `getByRole` sempre que possível.

---

## 📊 Analytics

O Dashboard calcula métricas a partir das tarefas salvas:

- produtividade geral;
- tarefas concluídas;
- tarefas pendentes;
- tarefas de alta prioridade;
- produtividade semanal;
- distribuição por prioridade;
- distribuição por categoria;
- categoria dominante;
- análise por período;
- comparação com período anterior;
- tarefas recentes do período;
- diagnóstico visual de evolução.

---

## 📱 Responsividade

O layout foi ajustado para:

- celulares pequenos;
- celulares grandes;
- tablets;
- notebooks;
- desktops;
- telas grandes.

No mobile, a navegação usa menu inferior com áreas principais e menu adicional para páginas secundárias.

---

## 🔎 SEO e preview social

O projeto possui configuração básica de SEO no `index.html`:

- título;
- descrição;
- keywords;
- autor;
- Open Graph;
- Twitter Card;
- favicon;
- manifest;
- robots.

Arquivos relacionados:

```txt
index.html
public/favicon.svg
public/site.webmanifest
public/robots.txt
public/og-image.png
public/og-preview.html
```

A página `public/og-preview.html` pode ser usada para gerar a imagem de preview social em `1200x630`.

---

## 🧪 Como rodar

Clone o repositório:

```bash
git clone https://github.com/Lynsz/lynflow.git
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

Acesse:

```txt
http://localhost:4173
```

---

## 🧪 Testes

Para rodar os testes em modo watch:

```bash
npm run test
```

Para rodar os testes uma vez:

```bash
npm run test:run
```

Para rodar lint, testes e build:

```bash
npm run check
```

Para rodar testes end-to-end:

```bash
npm run test:e2e
```

Para abrir o runner visual do Playwright:

```bash
npm run test:e2e:ui
```

### Status atual

```txt
31 arquivos de teste
148 testes passando
```

### Cobertura funcional

Os testes protegem:

- autenticação local;
- rotas protegidas;
- tarefas;
- filtros;
- recorrência;
- calendário;
- notificações;
- exportação CSV;
- exportação/importação de backup;
- analytics;
- dashboard por período;
- goals;
- sincronização;
- Supabase types;
- componentes de UI;
- acessibilidade básica;
- fluxos principais do app.

---

## 🚀 Deploy

O Lynflow está preparado para deploy na Vercel.

### Configuração esperada

| Campo | Valor |
|---|---|
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Arquivo `vercel.json`

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

Esse rewrite garante que rotas internas do React Router funcionem corretamente no deploy.

### Rotas para testar após deploy

```txt
/
 /login
 /register
 /dashboard
 /tasks
 /calendar
 /goals
 /insights
 /activity
 /profile
 /settings
 /qualquer-rota
```

A rota inválida deve abrir a página 404 personalizada do app.

---

## 🖼️ Como atualizar os previews

Arquivos usados no README:

```txt
src/assets/preview.gif
src/assets/landing-preview.png
src/assets/dashboard-preview.png
src/assets/tasks-preview.png
src/assets/activity-preview.png
public/og-image.png
```

Para gerar o preview social:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:5173/og-preview.html
```

Use o DevTools em modo responsivo:

```txt
1200 x 630
```

Salve o screenshot como:

```txt
public/og-image.png
```

---

## ✅ Checklist de produção

- [x] Build sem erros.
- [x] Testes passando.
- [x] Login testado.
- [x] Cadastro testado.
- [x] Dashboard testado.
- [x] Tasks testado.
- [x] Calendar testado.
- [x] Activity testado.
- [x] Profile testado.
- [x] Settings testado.
- [x] Tema claro/escuro testado.
- [x] Notificações testadas.
- [x] Exportação de backup testada.
- [x] Importação de backup testada.
- [x] Página 404 configurada.
- [x] Responsividade revisada.
- [x] Deploy preparado.

---

## 🧠 Decisões técnicas

### Por que `localStorage`?

Para manter o projeto fácil de rodar, testar e apresentar. O modo local garante que qualquer pessoa consiga abrir o app sem configurar backend.

### Por que Supabase opcional?

Para evoluir o projeto para autenticação real, persistência remota, multiusuário e realtime sem quebrar a experiência local.

### Por que Context API?

Porque o app possui várias páginas consumindo tarefas e atividades. Centralizar o estado evita inconsistências entre telas.

### Por que DnD Kit?

Porque é uma solução moderna, acessível e flexível para drag and drop em React.

### Por que Recharts?

Porque permite criar gráficos funcionais e responsivos com boa integração ao React.

### Por que Command Palette?

Porque melhora a experiência do produto e aproxima o Lynflow de aplicações SaaS modernas.

### Por que testes automatizados?

Porque o projeto cresceu em escopo e precisa de segurança para evoluir sem regressões.

### Por que PWA?

Para adicionar experiência de app instalável, página offline e cache básico de navegação.

---

## 🧭 Roadmap

### Concluído

- [x] Landing page.
- [x] Login.
- [x] Cadastro.
- [x] Rotas protegidas.
- [x] Dashboard.
- [x] Dashboard com dados por período.
- [x] Tasks.
- [x] Datas de vencimento.
- [x] Recorrência de tarefas.
- [x] Filtro de tarefas atrasadas.
- [x] Kanban view.
- [x] Drag and drop.
- [x] Persistência da visualização de Tasks.
- [x] Cards de resumo filtráveis.
- [x] Painel de prazos.
- [x] Exportação CSV.
- [x] Ações em massa.
- [x] Calendar.
- [x] Notificações.
- [x] Goals.
- [x] Goals 2.0.
- [x] AI Insights.
- [x] IA real opcional.
- [x] Activity.
- [x] Profile.
- [x] Settings.
- [x] Tema claro/escuro.
- [x] Toast notifications.
- [x] Modal de confirmação.
- [x] Skeleton loading.
- [x] Histórico de atividades.
- [x] Command Palette.
- [x] Atalhos globais.
- [x] Onboarding.
- [x] Página 404.
- [x] Error Boundary.
- [x] Checklist pré-deploy.
- [x] Guia de deploy.
- [x] SEO básico.
- [x] Manifest.
- [x] Preview social.
- [x] Configuração Vercel.
- [x] Supabase opcional.
- [x] Multiusuário com Supabase opcional.
- [x] Realtime com Supabase.
- [x] Sincronização avançada entre dispositivos.
- [x] Exportação de backup.
- [x] Importação de backup.
- [x] Testes automatizados.
- [x] Testes end-to-end.
- [x] CI com GitHub Actions.
- [x] PWA básico.
- [x] Service worker.
- [x] Página offline.
- [x] Status de instalação do app.
- [x] Melhorias de acessibilidade.

### Próximas melhorias possíveis

O projeto está em versão estável. Próximas evoluções devem ser tratadas como versão futura:

- [ ] Integração com calendário externo.
- [ ] Notificações push reais.
- [ ] Relatórios mensais exportáveis.
- [ ] Dashboard financeiro de produtividade.
- [ ] Colaboração entre usuários.
- [ ] Templates de rotina.
- [ ] Versão mobile dedicada.

---

## 📌 Status do projeto

```txt
Versão: 1.0.0
Status: Portfolio Ready
Tipo: Front-end SaaS dashboard
Deploy: Vercel
Persistência padrão: localStorage
Backend opcional: Supabase
IA opcional: serverless API
Testes: Vitest + Testing Library + Playwright
```

---

## 👩‍💻 Autora

Desenvolvido por **Kethelyn Carvalho**.

- GitHub: [@Lynsz](https://github.com/Lynsz)
- LinkedIn: [@kethelyncarvalho](https://www.linkedin.com/in/kethelyncarvalho/)
- Projeto: [Lynflow](https://github.com/Lynsz/lynflow)

---

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo, portfólio e demonstração técnica.