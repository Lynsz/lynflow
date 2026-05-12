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
import { FeatureCard } from "../components/public/FeatureCard"
import { PublicHeader } from "../components/public/PublicHeader"
import { LinkButton } from "../components/ui/LinkButton"

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

const techs = [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Recharts",
]

const previewTasks = [
    "Finalizar layout premium",
    "Criar README profissional",
    "Preparar deploy na Vercel",
]

export function Landing() {
    return (
        <div className="ly-page min-h-screen">
            <PublicHeader />

            <main>
                <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1fr_0.95fr] lg:pt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-500">
                            <Zap size={16} />
                            MVP de produtividade com visual SaaS
                        </div>

                        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
                            Organize sua rotina com uma interface moderna e inteligente.
                        </h1>

                        <p className="ly-muted mt-6 max-w-2xl text-lg leading-8">
                            Lynflow é um dashboard de produtividade inspirado em Linear,
                            Notion, Trello e Stripe Dashboard. Ideal para demonstrar
                            arquitetura, UI moderna, TypeScript e lógica de produto.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <LinkButton
                                to="/register"
                                size="lg"
                                icon={<ArrowRight size={18} />}
                            >
                                Criar conta grátis
                            </LinkButton>

                            <LinkButton to="/login" variant="secondary" size="lg">
                                Acessar app
                            </LinkButton>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3 text-sm">
                            {techs.map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full border border-[var(--border)] px-4 py-2 text-[var(--muted)]"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        id="preview"
                        initial={{ opacity: 0, scale: 0.96, y: 18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className="ly-card rounded-[2rem] p-4 shadow-2xl shadow-black/10"
                    >
                        <div className="ly-card-strong rounded-[1.5rem] p-5">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="ly-muted-soft text-sm">Preview</p>
                                    <h2 className="text-2xl font-bold">Dashboard</h2>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                                    <Moon size={20} />
                                </div>
                            </div>

                            <div className="mb-5 grid grid-cols-3 gap-3">
                                <div className="ly-card rounded-2xl p-4">
                                    <p className="ly-muted-soft text-xs">Produtividade</p>
                                    <strong className="mt-2 block text-2xl">84%</strong>
                                </div>

                                <div className="ly-card rounded-2xl p-4">
                                    <p className="ly-muted-soft text-xs">Concluídas</p>
                                    <strong className="mt-2 block text-2xl">12</strong>
                                </div>

                                <div className="ly-card rounded-2xl p-4">
                                    <p className="ly-muted-soft text-xs">Pendentes</p>
                                    <strong className="mt-2 block text-2xl">4</strong>
                                </div>
                            </div>

                            <div className="mb-5 h-40 rounded-2xl border border-[var(--border)] bg-emerald-500/5 p-4">
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
                                {previewTasks.map((task, index) => (
                                    <div
                                        key={task}
                                        className="ly-card flex items-center gap-3 rounded-2xl px-4 py-3"
                                    >
                                        <div
                                            className={`h-4 w-4 rounded-full border ${index === 0
                                                    ? "border-emerald-500 bg-emerald-500"
                                                    : "border-[var(--border)]"
                                                }`}
                                        />
                                        <span className="text-sm">{task}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section id="features" className="mx-auto max-w-7xl px-6 py-20">
                    <div className="mb-10 max-w-2xl">
                        <p className="text-sm text-emerald-500">Features</p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                            Tudo que um MVP de produto precisa demonstrar.
                        </h2>

                        <p className="ly-muted mt-4">
                            O objetivo é mostrar domínio de interface, organização de código,
                            lógica, componentização e visão de produto.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                delay={index * 0.05}
                            />
                        ))}
                    </div>
                </section>

                <section id="roadmap" className="mx-auto max-w-7xl px-6 py-20">
                    <div className="ly-card rounded-[2rem] p-6 md:p-8">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1fr]">
                            <div>
                                <p className="text-sm text-emerald-500">Roadmap</p>

                                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                    Próximas evoluções do Lynflow.
                                </h2>

                                <p className="ly-muted mt-4">
                                    Essas features deixam o projeto mais forte para recrutadores
                                    e mostram evolução técnica real.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {roadmap.map((item) => (
                                    <div
                                        key={item}
                                        className="ly-card-strong flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
                                    >
                                        <CheckCircle2 size={17} className="text-emerald-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-5xl px-6 py-20 text-center">
                    <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8 md:p-12">
                        <div className="ly-button-primary mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl">
                            <Target size={22} />
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Transforme o Lynflow em um projeto de portfólio completo.
                        </h2>

                        <p className="ly-muted mx-auto mt-4 max-w-2xl">
                            Com landing page, login, dashboard, tarefas, métricas e IA
                            simulada, o projeto já passa a parecer um produto real.
                        </p>

                        <LinkButton
                            to="/register"
                            size="lg"
                            className="mt-8"
                            icon={<ArrowRight size={18} />}
                        >
                            Começar agora
                        </LinkButton>
                    </div>
                </section>
            </main>

            <footer className="border-t border-[var(--border)] px-6 py-8">
                <div className="ly-muted-soft mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
                    <p>© 2026 Lynflow. Projeto de portfólio front-end.</p>
                    <p>React · TypeScript · Tailwind · Framer Motion</p>
                </div>
            </footer>
        </div>
    )
}