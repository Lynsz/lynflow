import { CalendarClock, CalendarX2, RotateCcw } from "lucide-react"
import { useTasks } from "../../hooks/useTasks"
import { useToast } from "../ui/ToastProvider"
import { Button } from "../ui/Button"
import type { Task, TaskRecurrence } from "../../types/task"
import {
    getTaskRecurrenceLabel,
    getTaskRecurrenceSuggestions,
    normalizeTaskRecurrence,
    taskRecurrences,
    type RecurrenceOption,
} from "../../utils/taskRecurrence"
import { formatDatePtBr } from "../../utils/date"

type TaskDateActionsProps = {
    task: Task
}

export function TaskDateActions({ task }: TaskDateActionsProps) {
    const { updateTask } = useTasks()
    const { showToast } = useToast()

    const suggestions = getTaskRecurrenceSuggestions(task)
    const selectedRecurrence = normalizeTaskRecurrence(task.recurrence)

    function handleReschedule(option: RecurrenceOption) {
        const suggestion = suggestions.find((item) => item.option === option)

        if (!suggestion) {
            return
        }

        updateTask(task.id, {
            dueDate: suggestion.nextDueDate,
        })

        showToast({
            type: "success",
            title: "Prazo atualizado",
            description: `${task.title} foi reagendada para ${formatDatePtBr(
                suggestion.nextDueDate
            )}.`,
        })
    }

    function handleClearDueDate() {
        updateTask(task.id, {
            dueDate: null,
        })

        showToast({
            type: "success",
            title: "Prazo removido",
            description: `${task.title} não possui mais vencimento definido.`,
        })
    }

    function handleRecurrenceChange(recurrence: TaskRecurrence) {
        updateTask(task.id, {
            recurrence,
        })

        showToast({
            type: "success",
            title: "Recorrencia atualizada",
            description: `${task.title}: ${getTaskRecurrenceLabel(recurrence)}.`,
        })
    }

    return (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="mb-3 flex items-center gap-2">
                <CalendarClock size={16} className="text-[var(--primary)]" />

                <p className="text-sm font-medium text-[var(--text)]">
                    Edição rápida de prazo
                </p>
            </div>

            <label className="mb-3 block text-xs font-medium text-[var(--muted)]">
                Recorrencia
                <select
                    value={selectedRecurrence}
                    onChange={(event) =>
                        handleRecurrenceChange(event.target.value as TaskRecurrence)
                    }
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
                >
                    {taskRecurrences.map((recurrence) => (
                        <option key={recurrence} value={recurrence}>
                            {getTaskRecurrenceLabel(recurrence)}
                        </option>
                    ))}
                </select>
            </label>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {suggestions.map((suggestion) => (
                    <Button
                        key={suggestion.option}
                        variant="secondary"
                        size="sm"
                        icon={<RotateCcw size={15} />}
                        onClick={() => handleReschedule(suggestion.option)}
                    >
                        {suggestion.label}
                    </Button>
                ))}
            </div>

            {task.dueDate && (
                <Button
                    variant="danger"
                    size="sm"
                    icon={<CalendarX2 size={15} />}
                    onClick={handleClearDueDate}
                    className="mt-2 w-full"
                >
                    Limpar prazo
                </Button>
            )}
        </div>
    )
}
