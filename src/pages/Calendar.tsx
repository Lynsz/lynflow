import { useMemo, useState } from "react"
import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    ListTodo,
    Target,
} from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton"
import { Button } from "../components/ui/Button"
import { EmptyState } from "../components/ui/EmptyState"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import { useToast } from "../components/ui/ToastProvider"
import { TaskDateActions } from "../components/tasks/TaskDateActions"
import {
    formatDateKey,
    getCalendarMonthDays,
    getCalendarMonthLabel,
    getCalendarSummary,
    getTasksByDueDate,
    sortCalendarTasks,
} from "../utils/taskCalendar"
import { formatDatePtBr } from "../utils/date"
import {
    generateNextRecurringTaskUpdate,
    getTaskRecurrenceLabel,
    hasActiveRecurrence,
    normalizeTaskRecurrence,
} from "../utils/taskRecurrence"
import { isTaskOverdue } from "../utils/taskStatus"
import type { Task } from "../types/task"

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function getPriorityLabel(priority: Task["priority"]) {
    if (priority === "high") return "Alta"
    if (priority === "medium") return "Média"

    return "Baixa"
}

function getPriorityClasses(priority: Task["priority"]) {
    if (priority === "high") {
        return "border-red-500/20 bg-red-500/10 text-red-400"
    }

    if (priority === "medium") {
        return "border-amber-500/20 bg-amber-500/10 text-amber-400"
    }

    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
}

export function Calendar() {
    const { isReady, tasks, toggleTask } = useTasks()
    const { showToast } = useToast()

    const [currentMonth, setCurrentMonth] = useState(() => new Date())
    const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()))

    const calendarDays = useMemo(() => {
        return getCalendarMonthDays(currentMonth)
    }, [currentMonth])

    const tasksByDueDate = useMemo(() => {
        return getTasksByDueDate(tasks)
    }, [tasks])

    const selectedTasks = useMemo(() => {
        return sortCalendarTasks(tasksByDueDate[selectedDate] ?? [])
    }, [selectedDate, tasksByDueDate])

    const summary = useMemo(() => {
        return getCalendarSummary(tasks, currentMonth)
    }, [tasks, currentMonth])

    const monthLabel = getCalendarMonthLabel(currentMonth)

    if (!isReady) {
        return <DashboardSkeleton />
    }

    function goToPreviousMonth() {
        setCurrentMonth((currentDate) => {
            return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        })
    }

    function goToNextMonth() {
        setCurrentMonth((currentDate) => {
            return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        })
    }

    function goToToday() {
        const today = new Date()

        setCurrentMonth(today)
        setSelectedDate(formatDateKey(today))
    }

    function handleToggleTask(task: Task) {
        const recurringUpdate = !task.done
            ? generateNextRecurringTaskUpdate(task)
            : null

        toggleTask(task.id)

        showToast({
            type: "success",
            title: recurringUpdate
                ? "Recorrencia reagendada"
                : task.done
                    ? "Tarefa reaberta"
                    : "Tarefa concluida",
            description: recurringUpdate
                ? `${task.title} avancou para ${formatDatePtBr(
                    recurringUpdate.dueDate
                )}.`
                : task.title,
        })
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="Planning system"
                title="Calendar"
                description="Visualize tarefas por vencimento, acompanhe atrasos e organize o mês com mais clareza."
                action={
                    <Button
                        size="lg"
                        icon={<CalendarDays size={18} />}
                        onClick={goToToday}
                    >
                        Hoje
                    </Button>
                }
            />

            <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Com prazo"
                    value={summary.tasksWithDueDate}
                    description="Tarefas com data de vencimento."
                    icon={<CalendarDays size={20} className="ly-accent" />}
                />

                <MetricCard
                    title="Neste mês"
                    value={summary.dueThisMonth}
                    description="Vencimentos no mês atual."
                    icon={<ListTodo size={20} className="ly-accent" />}
                    delay={0.05}
                />

                <MetricCard
                    title="Hoje"
                    value={summary.dueToday}
                    description="Tarefas pendentes para hoje."
                    icon={<Clock3 size={20} className="ly-warning" />}
                    delay={0.1}
                />

                <MetricCard
                    title="Atrasadas"
                    value={summary.overdue}
                    description="Pendências vencidas."
                    icon={<AlertTriangle size={20} className="ly-danger" />}
                    delay={0.15}
                />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.75fr]">
                <SectionCard
                    title="Calendário mensal"
                    description="Cada dia mostra as tarefas com vencimento definido."
                    action={
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<ChevronLeft size={16} />}
                                onClick={goToPreviousMonth}
                                aria-label="Mês anterior"
                                title="Mês anterior"
                            >
                                Anterior
                            </Button>

                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<ChevronRight size={16} />}
                                onClick={goToNextMonth}
                                aria-label="Próximo mês"
                                title="Próximo mês"
                            >
                                Próximo
                            </Button>
                        </div>
                    }
                >
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold capitalize text-[var(--text)]">
                            {monthLabel}
                        </h2>

                        <p className="ly-muted-soft text-sm">
                            Selecione um dia para ver os detalhes.
                        </p>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-[var(--muted-soft)]"
                            >
                                {day}
                            </div>
                        ))}

                        {calendarDays.map((day) => {
                            const dayTasks = tasksByDueDate[day.dateKey] ?? []
                            const pendingTasks = dayTasks.filter((task) => !task.done)
                            const hasTasks = dayTasks.length > 0
                            const isSelected = selectedDate === day.dateKey

                            return (
                                <button
                                    key={day.dateKey}
                                    type="button"
                                    onClick={() => setSelectedDate(day.dateKey)}
                                    className={`min-h-28 rounded-3xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-[var(--primary)] ${isSelected
                                            ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                            : "border-[var(--border)] bg-[var(--surface-strong)]"
                                        } ${day.isCurrentMonth
                                            ? "opacity-100"
                                            : "opacity-45"
                                        }`}
                                    aria-label={`Selecionar dia ${day.dayNumber}`}
                                    title={`Selecionar ${formatDatePtBr(day.dateKey)}`}
                                >
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <span
                                            className={`grid size-8 place-items-center rounded-full text-sm font-semibold ${day.isToday
                                                    ? "bg-[var(--primary)] text-white"
                                                    : "bg-[var(--surface)] text-[var(--text)]"
                                                }`}
                                        >
                                            {day.dayNumber}
                                        </span>

                                        {hasTasks && (
                                            <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--muted)]">
                                                {dayTasks.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        {sortCalendarTasks(dayTasks)
                                            .slice(0, 2)
                                            .map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`truncate rounded-xl px-2 py-1 text-xs ${task.done
                                                            ? "bg-emerald-500/10 text-emerald-400 line-through"
                                                            : "bg-[var(--surface)] text-[var(--text)]"
                                                        }`}
                                                >
                                                    {hasActiveRecurrence(task)
                                                        ? `${task.title} - ${getTaskRecurrenceLabel(
                                                            normalizeTaskRecurrence(
                                                                task.recurrence
                                                            )
                                                        )}`
                                                        : task.title}
                                                </div>
                                            ))}

                                        {dayTasks.length > 2 && (
                                            <p className="text-xs text-[var(--muted-soft)]">
                                                +{dayTasks.length - 2} tarefa(s)
                                            </p>
                                        )}

                                        {pendingTasks.length > 0 && (
                                            <p className="text-xs text-[var(--muted-soft)]">
                                                {pendingTasks.length} pendente(s)
                                            </p>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </SectionCard>

                <aside className="space-y-6">
                    <SectionCard
                        title={formatDatePtBr(selectedDate)}
                        description="Tarefas com vencimento neste dia."
                    >
                        {selectedTasks.length === 0 ? (
                            <EmptyState
                                icon={<CalendarDays size={20} />}
                                title="Nenhuma tarefa neste dia"
                                description="Tarefas com data de vencimento aparecerão aqui."
                            />
                        ) : (
                            <div className="space-y-3">
                                {selectedTasks.map((task) => {
                                    const overdue = isTaskOverdue(task)

                                    return (
                                        <div
                                            key={task.id}
                                            className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"
                                        >
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <div>
                                                    <p
                                                        className={`font-medium ${task.done
                                                                ? "text-[var(--muted)] line-through"
                                                                : "text-[var(--text)]"
                                                            }`}
                                                    >
                                                        {task.title}
                                                    </p>

                                                    <p className="ly-muted-soft mt-1 text-sm">
                                                        {task.category}
                                                    </p>
                                                </div>

                                                {task.done ? (
                                                    <CheckCircle2
                                                        size={18}
                                                        className="shrink-0 text-emerald-400"
                                                    />
                                                ) : overdue ? (
                                                    <AlertTriangle
                                                        size={18}
                                                        className="shrink-0 text-red-400"
                                                    />
                                                ) : (
                                                    <Target
                                                        size={18}
                                                        className="shrink-0 text-[var(--primary)]"
                                                    />
                                                )}
                                            </div>

                                            <div className="mb-4 flex flex-wrap gap-2">
                                                <span
                                                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getPriorityClasses(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {getPriorityLabel(task.priority)}
                                                </span>

                                                {overdue && !task.done && (
                                                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                                                        Atrasada
                                                    </span>
                                                )}

                                                {task.done && (
                                                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                                        Concluída
                                                    </span>
                                                )}

                                                {hasActiveRecurrence(task) && (
                                                    <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
                                                        {getTaskRecurrenceLabel(
                                                            normalizeTaskRecurrence(
                                                                task.recurrence
                                                            )
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <TaskDateActions task={task} />
                                            </div>

                                            <Button
                                                variant={task.done ? "secondary" : "primary"}
                                                size="sm"
                                                icon={
                                                    task.done ? (
                                                        <Clock3 size={16} />
                                                    ) : (
                                                        <CheckCircle2 size={16} />
                                                    )
                                                }
                                                onClick={() => handleToggleTask(task)}
                                            >
                                                {task.done
                                                    ? "Reabrir tarefa"
                                                    : "Concluir tarefa"}
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard
                        title="Resumo do mês"
                        description="Leitura rápida dos vencimentos atuais."
                    >
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-[var(--border)] pb-3">
                                <span className="ly-muted-soft">
                                    Tarefas no mês
                                </span>
                                <span>{summary.dueThisMonth}</span>
                            </div>

                            <div className="flex justify-between border-b border-[var(--border)] pb-3">
                                <span className="ly-muted-soft">
                                    Concluídas no mês
                                </span>
                                <span>{summary.completedThisMonth}</span>
                            </div>

                            <div className="flex justify-between border-b border-[var(--border)] pb-3">
                                <span className="ly-muted-soft">
                                    Pendentes hoje
                                </span>
                                <span>{summary.dueToday}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="ly-muted-soft">Atrasadas</span>
                                <span>{summary.overdue}</span>
                            </div>
                        </div>
                    </SectionCard>
                </aside>
            </section>
        </div>
    )
}
