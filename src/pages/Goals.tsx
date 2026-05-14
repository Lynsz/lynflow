import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
    CalendarCheck,
    CheckCircle2,
    Flame,
    ListTodo,
    Rocket,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
} from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import { Button } from "../components/ui/Button"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { ProgressBar } from "../components/ui/ProgressBar"
import { SectionCard } from "../components/ui/SectionCard"
import { getGoalHealth } from "../utils/goalHealth"

const weeklyPlan = [
    {
        title: "Validar qualidade",
        description: "Rodar lint, testes e build para garantir estabilidade.",
    },
    {
        title: "Atualizar documentação",
        description: "Manter README, screenshots e descrição do projeto alinhados.",
    },
    {
        title: "Refinar experiência",
        description: "Revisar responsividade, acessibilidade e estados vazios.",
    },
    {
        title: "Divulgar portfólio",
        description: "Publicar no LinkedIn, GitHub e currículo com clareza técnica.",
    },
]

const milestones = [
    {
        title: "Base do produto",
        description: "Landing page, autenticação, dashboard e rotas protegidas.",
        done: true,
    },
    {
        title: "Tasks avançado",
        description: "Filtros, Kanban, CSV, ações em massa e insights.",
        done: true,
    },
    {
        title: "Qualidade técnica",
        description: "Testes automatizados, utilitários isolados e CI.",
        done: true,
    },
    {
        title: "PWA e experiência",
        description: "Página offline, status de instalação, tema e feedback visual.",
        done: true,
    },
    {
        title: "Divulgação",
        description: "README, imagens, post no LinkedIn e apresentação do projeto.",
        done: false,
    },
]

function getHealthCardClasses(status: string) {
    if (status === "excellent") {
        return "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
    }

    if (status === "good") {
        return "border-sky-500/25 bg-sky-500/10 text-sky-400"
    }

    if (status === "attention") {
        return "border-amber-500/25 bg-amber-500/10 text-amber-400"
    }

    return "border-rose-500/25 bg-rose-500/10 text-rose-400"
}

export function Goals() {
    const navigate = useNavigate()

    const {
        productivity,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        tasks,
    } = useTasks()

    const goalHealth = useMemo(() => {
        return getGoalHealth({
            productivity,
            pendingTasks,
            highPriorityTasks,
        })
    }, [productivity, pendingTasks, highPriorityTasks])

    const completedMilestones = milestones.filter((milestone) => milestone.done).length

    const milestoneProgress = Math.round(
        (completedMilestones / milestones.length) * 100
    )

    const totalTasks = tasks.length

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="Progress system"
                title="Goals"
                description="Acompanhe metas, saúde do projeto e próximos passos para transformar o Lynflow em um case forte de portfólio."
                action={
                    <Button
                        size="lg"
                        icon={<ListTodo size={18} />}
                        onClick={() => navigate("/tasks")}
                    >
                        Ver tarefas
                    </Button>
                }
            />

            <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Progresso do MVP"
                    value={`${productivity}%`}
                    description="Baseado nas tarefas concluídas."
                    icon={<Target size={20} className="ly-accent" />}
                />

                <MetricCard
                    title="Concluídas"
                    value={completedTasks}
                    description="Tarefas finalizadas até agora."
                    icon={<CheckCircle2 size={20} className="ly-accent" />}
                    delay={0.05}
                />

                <MetricCard
                    title="Pendências"
                    value={pendingTasks}
                    description="Itens restantes para fechar o MVP."
                    icon={<Flame size={20} className="ly-warning" />}
                    delay={0.1}
                />

                <MetricCard
                    title="Milestones"
                    value={`${completedMilestones}/${milestones.length}`}
                    description="Marcos principais do projeto."
                    icon={<Trophy size={20} className="ly-accent" />}
                    delay={0.15}
                />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.85fr]">
                <SectionCard
                    title="Finalizar MVP"
                    description="Meta principal para transformar o Lynflow em um projeto publicável, testado e apresentável."
                >
                    <div className="space-y-5">
                        <p className="ly-muted text-sm leading-6">
                            Completar as páginas principais, refinar a experiência,
                            fortalecer a documentação, validar testes e preparar o
                            projeto para divulgação profissional.
                        </p>

                        <ProgressBar label="Progresso geral por tarefas" value={productivity} />

                        <ProgressBar
                            label="Progresso dos marcos do projeto"
                            value={milestoneProgress}
                        />

                        <div
                            className={`rounded-2xl border p-4 ${getHealthCardClasses(
                                goalHealth.status
                            )}`}
                        >
                            <div className="flex items-start gap-3">
                                <Sparkles size={20} className="mt-0.5 shrink-0" />

                                <div>
                                    <p className="font-semibold">{goalHealth.label}</p>

                                    <p className="mt-1 text-sm opacity-90">
                                        {goalHealth.description}
                                    </p>

                                    <p className="mt-2 text-sm opacity-80">
                                        {goalHealth.recommendation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Resumo técnico"
                    description="Indicadores derivados das tarefas atuais."
                >
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-[var(--border)] pb-3">
                            <span className="ly-muted-soft">Total de tarefas</span>
                            <span>{totalTasks}</span>
                        </div>

                        <div className="flex justify-between border-b border-[var(--border)] pb-3">
                            <span className="ly-muted-soft">Alta prioridade</span>
                            <span>{highPriorityTasks}</span>
                        </div>

                        <div className="flex justify-between border-b border-[var(--border)] pb-3">
                            <span className="ly-muted-soft">Tarefas concluídas</span>
                            <span>{completedTasks}</span>
                        </div>

                        <div className="flex justify-between border-b border-[var(--border)] pb-3">
                            <span className="ly-muted-soft">Tarefas pendentes</span>
                            <span>{pendingTasks}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="ly-muted-soft">Saúde da meta</span>
                            <span>{goalHealth.label}</span>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Milestones do Lynflow"
                    description="Marcos que mostram a evolução técnica do projeto."
                    className="xl:col-span-2"
                >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                        {milestones.map((milestone, index) => (
                            <div
                                key={milestone.title}
                                className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"
                            >
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <span className="grid size-9 place-items-center rounded-2xl bg-[var(--surface)] text-sm font-semibold text-[var(--primary)]">
                                        {index + 1}
                                    </span>

                                    {milestone.done ? (
                                        <CheckCircle2
                                            size={18}
                                            className="text-emerald-400"
                                        />
                                    ) : (
                                        <Rocket
                                            size={18}
                                            className="text-[var(--muted-soft)]"
                                        />
                                    )}
                                </div>

                                <p className="font-medium text-[var(--text)]">
                                    {milestone.title}
                                </p>

                                <p className="ly-muted-soft mt-2 text-sm leading-6">
                                    {milestone.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard
                    title="Plano da semana"
                    description="Sequência recomendada para deixar o projeto pronto para portfólio."
                    className="xl:col-span-2"
                >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {weeklyPlan.map((item, index) => (
                            <div
                                key={item.title}
                                className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-500">
                                    {index + 1}
                                </span>

                                <div>
                                    <p className="text-sm font-medium text-[var(--text)]">
                                        {item.title}
                                    </p>

                                    <p className="ly-muted-soft mt-1 text-sm leading-6">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard
                    title="Próxima evolução sugerida"
                    description="O que faz sentido implementar depois desta etapa."
                    className="xl:col-span-2"
                >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <TrendingUp
                                size={20}
                                className="mb-3 text-[var(--primary)]"
                            />

                            <p className="font-medium text-[var(--text)]">
                                Dashboard por período
                            </p>

                            <p className="ly-muted-soft mt-2 text-sm leading-6">
                                Criar métricas semanais e mensais para deixar o
                                dashboard mais analítico.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <CalendarCheck
                                size={20}
                                className="mb-3 text-[var(--primary)]"
                            />

                            <p className="font-medium text-[var(--text)]">
                                Calendário
                            </p>

                            <p className="ly-muted-soft mt-2 text-sm leading-6">
                                Visualizar tarefas por vencimento em uma interface
                                de calendário.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <Rocket
                                size={20}
                                className="mb-3 text-[var(--primary)]"
                            />

                            <p className="font-medium text-[var(--text)]">
                                Case de portfólio
                            </p>

                            <p className="ly-muted-soft mt-2 text-sm leading-6">
                                Criar uma página explicando problema, solução,
                                tecnologias e aprendizados.
                            </p>
                        </div>
                    </div>
                </SectionCard>
            </section>
        </div>
    )
}