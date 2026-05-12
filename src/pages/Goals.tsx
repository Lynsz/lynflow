import { useNavigate } from "react-router-dom"
import { CheckCircle2, Flame, ListTodo, Target } from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import { Button } from "../components/ui/Button"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { ProgressBar } from "../components/ui/ProgressBar"
import { SectionCard } from "../components/ui/SectionCard"

const weeklyPlan = [
    "Finalizar UI responsiva",
    "Preparar screenshots do projeto",
    "Escrever README profissional",
    "Fazer deploy na Vercel",
]

export function Goals() {
    const navigate = useNavigate()

    const {
        productivity,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
    } = useTasks()

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="Progress system"
                title="Goals"
                description="Acompanhe metas semanais e evolução do projeto."
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

            <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
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
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.85fr]">
                <SectionCard
                    title="Finalizar MVP"
                    description="Meta principal para transformar o Lynflow em um projeto publicável."
                >
                    <div className="space-y-5">
                        <p className="ly-muted text-sm leading-6">
                            Completar as páginas principais, tarefas, dashboard, tema,
                            README e deploy. Essa meta representa a evolução geral do projeto.
                        </p>

                        <ProgressBar label="Progresso geral" value={productivity} />

                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                            <p className="text-sm text-[var(--text)] opacity-85">
                                Prioridade atual: manter consistência visual, reduzir repetição
                                de código e preparar o projeto para deploy.
                            </p>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Resumo técnico">
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-[var(--border)] pb-3">
                            <span className="ly-muted-soft">Alta prioridade</span>
                            <span>{highPriorityTasks}</span>
                        </div>

                        <div className="flex justify-between border-b border-[var(--border)] pb-3">
                            <span className="ly-muted-soft">Tarefas concluídas</span>
                            <span>{completedTasks}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="ly-muted-soft">Tarefas pendentes</span>
                            <span>{pendingTasks}</span>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Plano da semana"
                    description="Sequência recomendada para finalizar a primeira versão."
                    className="xl:col-span-2"
                >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {weeklyPlan.map((item, index) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-sm text-emerald-500">
                                    {index + 1}
                                </span>

                                <span className="text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </section>
        </div>
    )
}