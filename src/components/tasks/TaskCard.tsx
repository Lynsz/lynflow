import { motion } from "framer-motion"
import { GripVertical, Trash2 } from "lucide-react"
import type { Priority, Task } from "../../types/task"
import { Input } from "../ui/Input"

type TaskCardProps = {
    task: Task
    isEditing: boolean
    editingTitle: string
    onEditingTitleChange: (value: string) => void
    onStartEdit: (task: Task) => void
    onSaveEdit: (id: string) => void
    onCancelEdit: () => void
    onToggle: (id: string) => void
    onDelete: (id: string) => void
    isDragDisabled?: boolean
}

function getPriorityLabel(priority: Priority) {
    if (priority === "high") return "Alta"
    if (priority === "medium") return "Média"
    return "Baixa"
}

function getPriorityClass(priority: Priority) {
    if (priority === "high") {
        return "border-red-500/20 bg-red-500/10 text-red-500"
    }

    if (priority === "medium") {
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
    }

    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
}

export function TaskCard({
    task,
    isEditing,
    editingTitle,
    onEditingTitleChange,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onToggle,
    onDelete,
    isDragDisabled = false,
}: TaskCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className="ly-card-strong rounded-2xl p-4"
        >
            <div className="flex items-start gap-4">
                <div
                    className={`mt-1 text-[var(--muted-soft)] ${isDragDisabled ? "opacity-30" : "cursor-grab active:cursor-grabbing"
                        }`}
                    title={
                        isDragDisabled
                            ? "Use a ordenação Manual para arrastar"
                            : "Arraste para reordenar"
                    }
                    aria-label={
                        isDragDisabled
                            ? "Arrastar desativado"
                            : "Arrastar para reordenar"
                    }
                >
                    <GripVertical size={18} />
                </div>

                <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggle(task.id)}
                    aria-label="Concluir tarefa"
                    title="Concluir tarefa"
                    className="mt-1 h-4 w-4 accent-emerald-500"
                />

                <div className="min-w-0 flex-1">
                    {isEditing ? (
                        <Input
                            value={editingTitle}
                            onChange={(event) => onEditingTitleChange(event.target.value)}
                            onBlur={() => onSaveEdit(task.id)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    onSaveEdit(task.id)
                                }

                                if (event.key === "Escape") {
                                    onCancelEdit()
                                }
                            }}
                            autoFocus
                            aria-label="Editar título da tarefa"
                            title="Editar título da tarefa"
                            placeholder="Editar título da tarefa"
                            className="rounded-xl px-3 py-2"
                        />
                    ) : (
                        <button
                            type="button"
                            onDoubleClick={() => onStartEdit(task)}
                            className={`block text-left ${task.done
                                    ? "ly-muted-soft line-through"
                                    : "text-[var(--text)]"
                                }`}
                        >
                            {task.title}
                        </button>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                            {task.category}
                        </span>

                        <span
                            className={`rounded-full border px-3 py-1 text-xs ${getPriorityClass(
                                task.priority
                            )}`}
                        >
                            {getPriorityLabel(task.priority)}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onDelete(task.id)}
                    aria-label="Deletar tarefa"
                    title="Deletar tarefa"
                    className="rounded-xl p-2 text-[var(--muted-soft)] transition hover:bg-red-500/10 hover:text-red-500"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    )
}