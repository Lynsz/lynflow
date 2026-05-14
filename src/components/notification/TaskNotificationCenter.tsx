import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    AlertTriangle,
    Bell,
    CalendarClock,
    CheckCircle2,
    Clock3,
    Target,
} from "lucide-react"
import { useTasks } from "../../hooks/useTasks"
import {
    getTaskNotifications,
    type TaskNotification,
} from "../../utils/taskNotifications"



function getNotificationIcon(type: TaskNotification["type"]) {
    if (type === "overdue") {
        return <AlertTriangle size={16} className="text-red-400" />
    }

    if (type === "due-today") {
        return <Clock3 size={16} className="text-amber-400" />
    }

    if (type === "due-soon") {
        return <CalendarClock size={16} className="text-sky-400" />
    }

    return <Target size={16} className="text-violet-400" />
}

function getNotificationClasses(type: TaskNotification["type"]) {
    if (type === "overdue") {
        return "border-red-500/20 bg-red-500/10"
    }

    if (type === "due-today") {
        return "border-amber-500/20 bg-amber-500/10"
    }

    if (type === "due-soon") {
        return "border-sky-500/20 bg-sky-500/10"
    }

    return "border-violet-500/20 bg-violet-500/10"
}

export function TaskNotificationCenter() {
    const navigate = useNavigate()
    const { tasks } = useTasks()
    const [isOpen, setIsOpen] = useState(false)

    const notifications = useMemo(() => {
        return getTaskNotifications(tasks)
    }, [tasks])

    const visibleNotifications = notifications.slice(0, 6)
    const notificationCount = notifications.length

    function openTasksPage() {
        setIsOpen(false)
        navigate("/tasks")
    }

    function openCalendarPage() {
        setIsOpen(false)
        navigate("/calendar")
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                className="relative inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--muted-soft)] hover:text-[var(--text)]"
                aria-label="Abrir notificações"
                title="Abrir notificações"
                aria-expanded={isOpen ? "true" : "false"}
            >
                <Bell size={16} />

                <span className="hidden sm:inline">Notificações</span>

                {notificationCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-2xl shadow-black/30">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-[var(--text)]">
                                Notificações
                            </h2>

                            <p className="ly-muted-soft text-sm">
                                Alertas automáticos baseados nas tarefas.
                            </p>
                        </div>

                        {notificationCount > 0 && (
                            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
                                {notificationCount}
                            </span>
                        )}
                    </div>

                    {notificationCount === 0 ? (
                        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-400" />

                                <p className="font-medium text-[var(--text)]">
                                    Tudo em ordem
                                </p>
                            </div>

                            <p className="ly-muted-soft text-sm leading-6">
                                Nenhuma tarefa atrasada, vencendo hoje ou sem prazo crítico.
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                            {visibleNotifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    type="button"
                                    onClick={openTasksPage}
                                    className={`w-full rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-[var(--primary)] ${getNotificationClasses(
                                        notification.type
                                    )}`}
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        {getNotificationIcon(notification.type)}

                                        <p className="text-sm font-semibold text-[var(--text)]">
                                            {notification.title}
                                        </p>
                                    </div>

                                    <p className="text-sm leading-6 text-[var(--muted)]">
                                        {notification.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={openTasksPage}
                            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--primary)]"
                        >
                            Ver tarefas
                        </button>

                        <button
                            type="button"
                            onClick={openCalendarPage}
                            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--primary)]"
                        >
                            Ver calendário
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}