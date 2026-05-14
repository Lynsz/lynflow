import { ArrowRight, CheckCircle2, ClipboardList, Rocket, Target } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getDashboardFocus } from "../../utils/dashboardFocus"
import { Button } from "../ui/Button"

type DashboardFocusPanelProps = {
    productivity: number
    pendingTasks: number
    highPriorityTasks: number
    totalTasks: number
}

function getStatusClasses(status: string) {
    if (status === "launch-ready") {
        return "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
    }

    if (status === "almost-there") {
        return "border-sky-500/25 bg-sky-500/10 text-sky-400"
    }

    if (status === "needs-focus") {
        return "border-amber-500/25 bg-amber-500/10 text-amber-400"
    }

    return "border-violet-500/25 bg-violet-500/10 text-violet-400"
}

export function DashboardFocusPanel({
    productivity,
    pendingTasks,
    highPriorityTasks,
    totalTasks,
}: DashboardFocusPanelProps) {
    const navigate = useNavigate()

    const focus = getDashboardFocus({
        productivity,
        pendingTasks,
        highPriorityTasks,
        totalTasks,
    })

    return (
        <section className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.85fr] xl:items-center">
                <div>
                    <div
                        className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            focus.status
                        )}`}
                    >
                        <Rocket size={14} />
                        {focus.label}
                    </div>

                    <h2 className="text-2xl font-semibold text-[var(--text)]">
                        {focus.title}
                    </h2>

                    <p className="ly-muted mt-3 max-w-3xl text-sm leading-6">
                        {focus.description}
                    </p>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <Button
                            size="sm"
                            icon={<ClipboardList size={16} />}
                            onClick={() => navigate("/tasks")}
                        >
                            {focus.primaryAction}
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<ArrowRight size={16} />}
                            onClick={() => navigate("/goals")}
                        >
                            {focus.secondaryAction}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-400" />
                            <span className="text-sm font-medium">
                                Produtividade
                            </span>
                        </div>

                        <p className="text-2xl font-semibold text-[var(--text)]">
                            {productivity}%
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <ClipboardList size={18} className="text-sky-400" />
                            <span className="text-sm font-medium">Pendentes</span>
                        </div>

                        <p className="text-2xl font-semibold text-[var(--text)]">
                            {pendingTasks}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Target size={18} className="text-rose-400" />
                            <span className="text-sm font-medium">
                                Alta prioridade
                            </span>
                        </div>

                        <p className="text-2xl font-semibold text-[var(--text)]">
                            {highPriorityTasks}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}