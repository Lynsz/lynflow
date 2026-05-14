import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    AlertTriangle,
    Bell,
    CalendarClock,
    CheckCircle2,
    Clock3,
    Target,
    X,
} from "lucide-react"
import { useTasks } from "../../hooks/useTasks"
import {
    getTaskNotifications,
    type TaskNotification,
} from "../../utils/taskNotifications"
import { LiveRegion } from "../accessibility/LiveRegion"

function getNotificationIcon(type: TaskNotification["type"]) {
    if (type === "overdue") {
        return <AlertTriangle size={16} className="text-red-400" aria-hidden="true" />
    }

    if (type === "due-today") {
        return <Clock3 size={16} className="text-amber-400" aria-hidden="true" />
    }

    if (type === "due-soon") {
        return (
            <CalendarClock
                size={16}
                className="text-sky-400"
                aria-hidden="true"
            />
        )
    }

    return <Target size={16} className="text-violet-400" aria-hidden="true" />
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

function getNotificationCountLabel(count: number) {
    if (count === 0) {
        return "Nenhuma notificação"
    }

    if (count === 1) {
        return "1 notificação"
    }

    return `${count} notificações`
}

export function TaskNotificationCenter() {
    const navigate = useNavigate()
    const { tasks } = useTasks()

    const panelId = useId()
    const titleId = useId()
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)

    const [isOpen, setIsOpen] = useState(false)

    const notifications = useMemo(() => {
        return getTaskNotifications(tasks)
    }, [tasks])

    const visibleNotifications = notifications.slice(0, 8)
    const notificationCount = notifications.length
    const countLabel = getNotificationCountLabel(notificationCount)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false)
                buttonRef.current?.focus()
            }
        }

        function handlePointerDown(event: PointerEvent) {
            const target = event.target

            if (!(target instanceof Node)) {
                return
            }

            const clickedInsidePanel = panelRef.current?.contains(target)
            const clickedTrigger = buttonRef.current?.contains(target)

            if (!clickedInsidePanel && !clickedTrigger) {
                setIsOpen(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("pointerdown", handlePointerDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("pointerdown", handlePointerDown)
        }
    }, [isOpen])

    function openTasksPage() {
        setIsOpen(false)
        navigate("/tasks")
    }

    function openCalendarPage() {
        setIsOpen(false)
        navigate("/calendar")
    }

    function closePanel() {
        setIsOpen(false)
        buttonRef.current?.focus()
    }

    return (
        <div className="relative">
            <LiveRegion
                message={
                    notificationCount > 0
                        ? `${countLabel} pendente(s) no Lynflow.`
                        : "Nenhuma notificação pendente no Lynflow."
                }
            />

            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                className="relative inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--muted-soft)] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
                aria-label={`${isOpen ? "Fechar" : "Abrir"} notificações. ${countLabel}.`}
                title={`${isOpen ? "Fechar" : "Abrir"} notificações`}
                aria-expanded={isOpen ? "true" : "false"}
                aria-controls={panelId}
            >
                <Bell size={16} aria-hidden="true" />

                <span className="hidden sm:inline">Notificações</span>

                {notificationCount > 0 && (
                    <span
                        className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                        aria-hidden="true"
                    >
                        {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    ref={panelRef}
                    id={panelId}
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby={titleId}
                    className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(26rem,calc(100vw-2rem))] rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-2xl shadow-black/30"
                >
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                            <h2
                                id={titleId}
                                className="font-semibold text-[var(--text)]"
                            >
                                Notificações
                            </h2>

                            <p className="ly-muted-soft text-sm">
                                Alertas automáticos baseados nas tarefas.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {notificationCount > 0 && (
                                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
                                    {notificationCount}
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={closePanel}
                                className="rounded-xl p-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                aria-label="Fechar notificações"
                                title="Fechar notificações"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    {notificationCount === 0 ? (
                        <div
                            className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4"
                            role="status"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-emerald-400"
                                    aria-hidden="true"
                                />

                                <p className="font-medium text-[var(--text)]">
                                    Tudo em ordem
                                </p>
                            </div>

                            <p className="ly-muted-soft text-sm leading-6">
                                Nenhuma tarefa atrasada, vencendo hoje ou sem prazo
                                crítico.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="ly-scrollbar max-h-96 space-y-3 overflow-y-auto pr-1"
                            aria-label="Lista de notificações"
                        >
                            {visibleNotifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    type="button"
                                    onClick={openTasksPage}
                                    className={`w-full rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${getNotificationClasses(
                                        notification.type
                                    )}`}
                                    aria-label={`${notification.title}. ${notification.description}`}
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

                            {notificationCount > visibleNotifications.length && (
                                <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center text-xs text-[var(--muted)]">
                                    +{notificationCount - visibleNotifications.length} alerta(s)
                                    adicional(is)
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={openTasksPage}
                            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            Ver tarefas
                        </button>

                        <button
                            type="button"
                            onClick={openCalendarPage}
                            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            Ver calendário
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}