import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    LayoutDashboard,
    Moon,
    Sparkles,
    Target,
    Zap,
} from "lucide-react"

const features = [
    {
        icon: LayoutDashboard,
        title: "Dashboard moderno",
        description:
            "Visualize produtividade, tarefas, metas e insights em uma interface limpa.",
    },
    {
        icon: CheckCircle2,
        title: "Sistema de tarefas",
        description:
            "Crie, edite, conclua e organize tarefas por prioridade e categoria.",
    },
    {
        icon: Sparkles,
        title: "IA Insights",
        description:
            "Receba sugestões inteligentes para organizar melhor sua rotina.",
    },
    {
        icon: BarChart3,
        title: "Métricas visuais",
        description:
            "Acompanhe produtividade semanal com gráficos e cards de resumo.",
    },
]

const roadmap = [
    "Autenticação real com Supabase",
    "Calendário integrado",
    "Drag and drop de tarefas",
    "Notificações",
    "Perfil do usuário",
    "Analytics avançado",
]

export function Landing() {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1f2937_0,#09090b_42%,#000_100%)] text-white">
            <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black">
                        <Sparkles size={20} />
                    </div>

                    <div>
                        <strong className="block text-lg tracking-tight">Lynflow</strong>
                        <span className="text-xs text-zinc-500">AI productivity OS</span>
                    </div>
                </Link>

                <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
                    <a href="#features" className="transition hover:text-white">
                        Benefícios
                    </a>
                    <a href="#preview" className="transition hover:text-white">
                        Preview
                    </a>
                    <a href="#roadmap" className="transition hover:text-white">
                        Roadmap
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="hidden rounded-xl px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white md:inline-flex"
                    >
                        Entrar
                    </Link>

                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]"
                    >
                        Começar
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </header>

            <main>
                <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1fr_0.95fr] lg:pt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                            <Zap size={16} />
                            MVP de produtividade com visual SaaS
                        </div>

                        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
                            Organize sua rotina com uma interface moderna e inteligente.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                            Lynflow é um dashboard de produtividade inspirado em Linear,
                            Notion, Trello e Stripe Dashboard. Ideal para demonstrar
                            arquitetura, UI moderna, TypeScript e lógica de produto.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]"
                            >
                                Criar conta grátis
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-3 font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
                            >
                                Acessar app
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3 text-sm text-zinc-500">
                            <span className="rounded-full border border-zinc-800 px-4 py-2">
                                React
                            </span>
                            <span className="rounded-full border border-zinc-800 px-4 py-2">
                                TypeScript
                            </span>
                            <span className="rounded-full border border-zinc-800 px-4 py-2">
                                Tailwind CSS
                            </span>
                            <span className="rounded-full border border-zinc-800 px-4 py-2">
                                Framer Motion
                            </span>
                            <span className="rounded-full border border-zinc-800 px-4 py-2">
                                Recharts
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        id="preview"
                        initial={{ opacity: 0, scale: 0.96, y: 18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className="rounded-[2rem] border border-zinc-800 bg-zinc-900/70 p-4 shadow-2xl shadow-black/40"
                    >
                        <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-5">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500">Preview</p>
                                    <h2 className="text-2xl font-bold">Dashboard</h2>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                                    <Moon size={20} />
                                </div>
                            </div>

                            <div className="mb-5 grid grid-cols-3 gap-3">
                                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                                    <p className="text-xs text-zinc-500">Produtividade</p>
                                    <strong className="mt-2 block text-2xl">84%</strong>
                                </div>

                                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                                    <p className="text-xs text-zinc-500">Concluídas</p>
                                    <strong className="mt-2 block text-2xl">12</strong>
                                </div>

                                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                                    <p className="text-xs text-zinc-500">Pendentes</p>
                                    <strong className="mt-2 block text-2xl">4</strong>
                                </div>
                            </div>

                            <div className="mb-5 h-40 rounded-2xl border border-zinc-800 bg-gradient-to-t from-emerald-500/10 to-zinc-900 p-4">
                                <div className="flex h-full items-end gap-3">
                                    {[35, 48, 62, 58, 76, 68, 84].map((height, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 rounded-t-xl bg-emerald-500/70"
                                            style={{ height: `${height}%` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    "Finalizar layout premium",
                                    "Criar README profissional",
                                    "Preparar deploy na Vercel",
                                ].map((task, index) => (
                                    <div
                                        key={task}
                                        className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3"
                                    >
                                        <div
                                            className={`h-4 w-4 rounded-full border ${index === 0
                                                ? "border-emerald-500 bg-emerald-500"
                                                : "border-zinc-600"
                                                }`}
                                        />
                                        <span className="text-sm text-zinc-300">{task}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section id="features" className="mx-auto max-w-7xl px-6 py-20">
                    <div className="mb-10 max-w-2xl">
                        <p className="text-sm text-emerald-400">Features</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                            Tudo que um MVP de produto precisa demonstrar.
                        </h2>
                        <p className="mt-4 text-zinc-400">
                            O objetivo é mostrar domínio de interface, organização de código,
                            lógica, componentização e visão de produto.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon

                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                                >
                                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
                                        <Icon size={21} />
                                    </div>

                                    <h3 className="text-lg font-semibold">{feature.title}</h3>

                                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </section>

                <section id="roadmap" className="mx-auto max-w-7xl px-6 py-20">
                    <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/70 p-6 md:p-8">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1fr]">
                            <div>
                                <p className="text-sm text-emerald-400">Roadmap</p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                    Próximas evoluções do Lynflow.
                                </h2>
                                <p className="mt-4 text-zinc-400">
                                    Essas features deixam o projeto mais forte para recrutadores
                                    e mostram evolução técnica real.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {roadmap.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300"
                                    >
                                        <CheckCircle2 size={17} className="text-emerald-400" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-5xl px-6 py-20 text-center">
                    <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8 md:p-12">
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                            <Target size={22} />
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Transforme o Lynflow em um projeto de portfólio completo.
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
                            Com landing page, login, dashboard, tarefas, métricas e IA
                            simulada, o projeto já passa a parecer um produto real.
                        </p>

                        <Link
                            to="/register"
                            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]"
                        >
                            Começar agora
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-zinc-800 px-6 py-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
                    <p>© 2026 Lynflow. Projeto de portfólio front-end.</p>
                    <p>React · TypeScript · Tailwind · Framer Motion</p>
                </div>
            </footer>
        </div>
    )
}