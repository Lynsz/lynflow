import {
    CheckCircle2,
    GripVertical,
    Plus,
    RotateCcw,
    Sparkles,
    Trash2,
    XCircle,
} from "lucide-react"
import type { ActivityType, TaskActivity } from "../../types/activity"
import { EmptyState } from "../ui/EmptyState"

type ActivityFeedProps = {
    activities: TaskActivity[]
    limit?: number
}

function getActivityIcon(type: ActivityType) {
    if (type === "created") {
        return <Plus size={17} />
    }

    if (type === "completed") {
        return <CheckCircle2 size={17} />
    }

    if (type === "reopened") {
        return <RotateCcw size={17} />
    }

    if (type === "deleted") {
        return <Trash2 size={17} />
    }

    if (type === "reordered") {
        return <GripVertical size={17} />
    }

    if (type === "cleared") {
        return <XCircle size={17} />
    }

    return <Sparkles size={17} />
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

function formatActivityDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date))
}

export function ActivityFeed({ activities, limit = 6 }: ActivityFeedProps) {
    const visibleActivities = activities.slice(0, limit)

    if (visibleActivities.length === 0) {
        return (
            <EmptyState
                icon={<Sparkles size={20} />}
                title="Nenhuma atividade ainda"
                description="Crie, conclua ou edite tarefas para gerar histórico."
            />
        )
    }

    return (
        <div className="space-y-3">
            {visibleActivities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"
                >
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${getActivityClass(
                            activity.type
                        )}`}
                    >
                        {getActivityIcon(activity.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-medium">{activity.title}</h3>

                            <span className="ly-muted-soft text-xs">
                                {formatActivityDate(activity.createdAt)}
                            </span>
                        </div>

                        <p className="ly-muted mt-1 text-sm leading-6">
                            {activity.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}