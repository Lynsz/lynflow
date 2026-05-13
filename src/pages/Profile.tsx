import { useNavigate } from "react-router-dom"
import {
    BarChart3,
    CheckCircle2,
    Clock3,
    LayoutDashboard,
    Settings,
    Target,
} from "lucide-react"
import { getCurrentUser } from "../services/auth"
import { useTasks } from "../hooks/useTasks"
import { Button } from "../components/ui/Button"
import { InfoRow } from "../components/ui/InfoRow"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { ProgressBar } from "../components/ui/ProgressBar"
import { SectionCard } from "../components/ui/SectionCard"
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton"

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
}

function getProductivityLabel(productivity: number) {
    if (productivity >= 75) return "Excelente"
    if (productivity >= 50) return "Bom progresso"
    if (productivity >= 25) return "Em evolução"
    return "Precisa de foco"
}

export function Profile() {
    const navigate = useNavigate()
    const user = getCurrentUser()

    const {
        isReady,
        tasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        productivity,
        categories,
    } = useTasks()

    if (!isReady) {
        return <DashboardSkeleton />
    }

    const userName = user?.name ?? "Usuária"
    const userEmail = user?.email ?? "Não informado"
    const initials = getInitials(userName)
    const productivityLabel = getProductivityLabel(productivity)

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="User profile"
                title="Profile"
                description="Resumo da conta local, produtividade e atividade no Lynflow."
                action={
                    <Button
                        variant="secondary"
                        icon={<Settings size={18} />}
                        onClick={() => navigate("/settings")}
                    >
                        Configurações
                    </Button>
                }
            />

            <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <SectionCard title="Conta local" description="Dados salvos no navegador.">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-[var(--primary)] text-3xl font-bold text-[var(--primary-text)]">
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-2xl font-bold">{userName}</h2>
                            <p className="ly-muted mt-1 break-all text-sm">{userEmail}</p>

                            <div className="mt-4 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-500">
                                Conta local ativa
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <InfoRow label="Nome" value={userName} />
                        <InfoRow label="E-mail" value={userEmail} />
                        <InfoRow
                            label="Persistência"
                            value="localStorage"
                            bordered={false}
                        />
                    </div>
                </SectionCard>

                <SectionCard
                    title="Produtividade pessoal"
                    description="Resumo do desempenho com base nas tarefas atuais."
                >
                    <div className="space-y-6">
                        <ProgressBar label="Produtividade geral" value={productivity} />

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <p className="text-sm leading-6 text-[var(--text)] opacity-85">
                                Status atual: <strong>{productivityLabel}</strong>. Você tem{" "}
                                <strong>{completedTasks}</strong> tarefa(s) concluída(s) e{" "}
                                <strong>{pendingTasks}</strong> pendente(s).
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Button
                                variant="secondary"
                                icon={<LayoutDashboard size={18} />}
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </Button>

                            <Button
                                variant="secondary"
                                icon={<CheckCircle2 size={18} />}
                                onClick={() => navigate("/tasks")}
                            >
                                Tarefas
                            </Button>

                            <Button
                                variant="secondary"
                                icon={<Target size={18} />}
                                onClick={() => navigate("/goals")}
                            >
                                Metas
                            </Button>
                        </div>
                    </div>
                </SectionCard>
            </section>

            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <MetricCard
                    title="Produtividade"
                    value={`${productivity}%`}
                    description={productivityLabel}
                    icon={<BarChart3 size={20} className="ly-accent" />}
                />

                <MetricCard
                    title="Total"
                    value={tasks.length}
                    description="Tarefas registradas."
                    icon={<CheckCircle2 size={20} className="ly-accent" />}
                    delay={0.05}
                />

                <MetricCard
                    title="Pendentes"
                    value={pendingTasks}
                    description="Itens em aberto."
                    icon={<Clock3 size={20} className="ly-warning" />}
                    delay={0.1}
                />

                <MetricCard
                    title="Alta prioridade"
                    value={highPriorityTasks}
                    description="Itens críticos."
                    icon={<Target size={20} className="ly-danger" />}
                    delay={0.15}
                />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.85fr]">
                <SectionCard
                    title="Categorias usadas"
                    description="Categorias criadas a partir das tarefas atuais."
                >
                    {categories.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted-soft)]">
                            Nenhuma categoria encontrada.
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <span
                                    key={category}
                                    className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm text-[var(--muted)]"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}
                </SectionCard>

                <SectionCard title="Resumo da atividade">
                    <div className="space-y-4">
                        <InfoRow label="Tarefas totais" value={tasks.length} />
                        <InfoRow label="Concluídas" value={completedTasks} />
                        <InfoRow label="Pendentes" value={pendingTasks} />
                        <InfoRow label="Alta prioridade" value={highPriorityTasks} />
                        <InfoRow
                            label="Categorias"
                            value={categories.length}
                            bordered={false}
                        />
                    </div>
                </SectionCard>
            </section>
        </div>
    )
}