import { useMemo, useState } from "react"
import {
    ArrowUpDown,
    CheckCircle2,
    FilterX,
    GripVertical,
    History,
    Plus,
    RotateCcw,
    Search,
    Sparkles,
    Trash2,
    XCircle,
} from "lucide-react"
import type { ActivityType } from "../types/activity"
import { useTasks } from "../hooks/useTasks"
import {
    filterAndSortActivities,
    type ActivityFilter,
    type ActivitySortOption,
} from "../utils/activityFilters"
import { Button } from "../components/ui/Button"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { Input } from "../components/ui/Input"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton"
import { useToast } from "../components/ui/ToastProvider"

const activityTypeOptions: Array<{ key: ActivityFilter; label: string }> = [
    { key: "all", label: "Todas" },
    { key: "created", label: "Criadas" },
    { key: "completed", label: "Concluídas" },
    { key: "reopened", label: "Reabertas" },
    { key: "deleted", label: "Deletadas" },
    { key: "reordered", label: "Reordenadas" },
    { key: "cleared", label: "Limpeza" },
    { key: "reset", label: "Demo" },
]

const sortOptions: Array<{ key: ActivitySortOption; label: string }> = [
    { key: "newest", label: "Mais recentes" },
    { key: "oldest", label: "Mais antigas" },
]

function getActivityIcon(type: ActivityType) {
    if (type === "created") {
        return <Plus size={18} />
    }

    if (type === "completed") {
        return <CheckCircle2 size={18} />
    }

    if (type === "reopened") {
        return <RotateCcw size={18} />
    }

    if (type === "deleted") {
        return <Trash2 size={18} />
    }

    if (type === "reordered") {
        return <GripVertical size={18} />
    }

    if (type === "cleared") {
        return <XCircle size={18} />
    }

    return <Sparkles size={18} />
}

function getActivityClass(type: ActivityType) {
    if (type === "completed") {
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
    }

    if (type === "deleted" || type === "cleared") {
        return "border-red-500/20 bg-red-500/10 text-red-500"
    }

    if (type === "reopened" || type === "reset") {
        return "border-blue-500/20 bg-blue-500/10 text-blue-500"
    }

    if (type === "reordered") {
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
    }

    return "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]"
}

function getActivityLabel(type: ActivityType) {
    if (type === "created") return "Criada"
    if (type === "completed") return "Concluída"
    if (type === "reopened") return "Reaberta"
    if (type === "deleted") return "Deletada"
    if (type === "reordered") return "Reordenada"
    if (type === "cleared") return "Limpeza"
    return "Demo"
}

function formatActivityDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date))
}

export function ActivityPage() {
    const { isReady, activities, clearActivities } = useTasks()
    const { showToast } = useToast()

    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState<ActivityFilter>("all")
    const [sortBy, setSortBy] = useState<ActivitySortOption>("newest")
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)

    const filteredActivities = useMemo(() => {
        return filterAndSortActivities({
            activities,
            search,
            type: typeFilter,
            sortBy,
        })
    }, [activities, search, typeFilter, sortBy])

    const createdCount = activities.filter(
        (activity) => activity.type === "created"
    ).length

    const completedCount = activities.filter(
        (activity) => activity.type === "completed"
    ).length

    const destructiveCount = activities.filter(
        (activity) => activity.type === "deleted" || activity.type === "cleared"
    ).length

    const hasActiveFilters =
        search.trim() !== "" || typeFilter !== "all" || sortBy !== "newest"

    if (!isReady) {
        return <DashboardSkeleton />
    }

    function clearFilters() {
        setSearch("")
        setTypeFilter("all")
        setSortBy("newest")

        showToast({
            type: "info",
            title: "Filtros limpos",
            description: "O histórico voltou para a visualização padrão.",
        })
    }

    function confirmClearActivities() {
        clearActivities()

        showToast({
            type: "success",
            title: "Histórico limpo",
            description: "Todas as atividades locais foram removidas.",
        })

        setIsClearDialogOpen(false)
    }

    return (
        <>
            <div className="ly-page px-4 py-6 md:px-8">
                <PageHeader
                    eyebrow="Activity center"
                    title="Activity"
                    description="Histórico local de ações feitas nas tarefas do Lynflow."
                    action={
                        <Button
                            variant="danger"
                            icon={<Trash2 size={18} />}
                            disabled={activities.length === 0}
                            onClick={() => setIsClearDialogOpen(true)}
                        >
                            Limpar histórico
                        </Button>
                    }
                />

                <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <MetricCard
                        title="Atividades"
                        value={activities.length}
                        description="Registros salvos localmente."
                        icon={<History size={20} className="ly-accent" />}
                    />

                    <MetricCard
                        title="Criadas"
                        value={createdCount}
                        description="Tarefas adicionadas."
                        icon={<Plus size={20} className="ly-accent" />}
                        delay={0.05}
                    />

                    <MetricCard
                        title="Concluídas"
                        value={completedCount}
                        description="Tarefas finalizadas."
                        icon={<CheckCircle2 size={20} className="ly-accent" />}
                        delay={0.1}
                    />

                    <MetricCard
                        title="Críticas"
                        value={destructiveCount}
                        description="Ações de delete/limpeza."
                        icon={<XCircle size={20} className="ly-danger" />}
                        delay={0.15}
                    />
                </section>

                <SectionCard
                    title="Filtros"
                    description="Busque, filtre por tipo e ordene o histórico."
                    action={
                        hasActiveFilters ? (
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<FilterX size={16} />}
                                onClick={clearFilters}
                            >
                                Limpar filtros
                            </Button>
                        ) : null
                    }
                >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_220px]">
                        <div className="relative">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-soft)]"
                            />

                            <label htmlFor="activity-search" className="sr-only">
                                Buscar atividade
                            </label>

                            <Input
                                id="activity-search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar no histórico..."
                                title="Buscar atividade"
                                aria-label="Buscar atividade"
                                className="pl-11"
                            />
                        </div>

                        <div>
                            <label htmlFor="activity-type" className="sr-only">
                                Tipo de atividade
                            </label>

                            <select
                                id="activity-type"
                                value={typeFilter}
                                onChange={(event) =>
                                    setTypeFilter(event.target.value as ActivityFilter)
                                }
                                title="Tipo de atividade"
                                aria-label="Tipo de atividade"
                                className="ly-input rounded-2xl px-4 py-3"
                            >
                                {activityTypeOptions.map((item) => (
                                    <option key={item.key} value={item.key}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="activity-sort" className="sr-only">
                                Ordenar atividades
                            </label>

                            <select
                                id="activity-sort"
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(event.target.value as ActivitySortOption)
                                }
                                title="Ordenar atividades"
                                aria-label="Ordenar atividades"
                                className="ly-input rounded-2xl px-4 py-3"
                            >
                                {sortOptions.map((item) => (
                                    <option key={item.key} value={item.key}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    className="mt-6"
                    title="Histórico completo"
                    description={`${filteredActivities.length} de ${activities.length} atividade(s) exibida(s).`}
                    action={
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <ArrowUpDown size={16} />
                            <span>{sortBy === "newest" ? "Recentes" : "Antigas"}</span>
                        </div>
                    }
                >
                    {filteredActivities.length === 0 ? (
                        <EmptyState
                            icon={<History size={20} />}
                            title="Nenhuma atividade encontrada"
                            description="Crie, conclua, delete ou reorganize tarefas para gerar histórico."
                        />
                    ) : (
                        <div className="space-y-3">
                            {filteredActivities.map((activity) => (
                                <article
                                    key={activity.id}
                                    className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"
                                >
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${getActivityClass(
                                            activity.type
                                        )}`}
                                    >
                                        {getActivityIcon(activity.type)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="font-semibold">{activity.title}</h3>

                                                <p className="ly-muted mt-1 text-sm leading-6">
                                                    {activity.description}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 flex-col gap-2 md:items-end">
                                                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                                                    {getActivityLabel(activity.type)}
                                                </span>

                                                <span className="ly-muted-soft text-xs">
                                                    {formatActivityDate(activity.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </SectionCard>
            </div>

            <ConfirmDialog
                isOpen={isClearDialogOpen}
                title="Limpar histórico de atividades?"
                description="Essa ação remove todas as atividades locais. Suas tarefas não serão apagadas."
                confirmLabel="Limpar histórico"
                cancelLabel="Cancelar"
                variant="danger"
                onConfirm={confirmClearActivities}
                onClose={() => setIsClearDialogOpen(false)}
            />
        </>
    )
}