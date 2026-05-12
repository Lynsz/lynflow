import { useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { ClipboardList, Plus } from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import type { Priority, Task } from "../types/task"
import { Button } from "../components/ui/Button"
import { EmptyState } from "../components/ui/EmptyState"
import { Input } from "../components/ui/Input"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import { TaskCard } from "../components/tasks/TaskCard"

type Filter = "all" | "todo" | "done"

const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: "Todas" },
    { key: "todo", label: "Pendentes" },
    { key: "done", label: "Concluídas" },
]

export function Tasks() {
    const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTasks()

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("Geral")
    const [priority, setPriority] = useState<Priority>("medium")
    const [filter, setFilter] = useState<Filter>("all")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingTitle, setEditingTitle] = useState("")

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (filter === "done") return task.done
            if (filter === "todo") return !task.done
            return true
        })
    }, [tasks, filter])

    function handleAddTask(event: React.FormEvent) {
        event.preventDefault()

        if (!title.trim()) return

        addTask({
            title,
            category,
            priority,
        })

        setTitle("")
        setCategory("Geral")
        setPriority("medium")
    }

    function startEdit(task: Task) {
        setEditingId(task.id)
        setEditingTitle(task.title)
    }

    function saveEdit(id: string) {
        if (!editingTitle.trim()) {
            setEditingId(null)
            setEditingTitle("")
            return
        }

        updateTask(id, {
            title: editingTitle.trim(),
        })

        setEditingId(null)
        setEditingTitle("")
    }

    function cancelEdit() {
        setEditingId(null)
        setEditingTitle("")
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="Task system"
                title="Tasks"
                description="Crie, organize, edite e conclua tarefas com prioridade e categoria."
            />

            <SectionCard
                title="Lista de tarefas"
                description="Clique duas vezes no título para editar."
                action={
                    <div className="flex flex-wrap gap-2">
                        {filters.map((item) => (
                            <Button
                                key={item.key}
                                type="button"
                                variant={filter === item.key ? "primary" : "secondary"}
                                size="sm"
                                onClick={() => setFilter(item.key)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </div>
                }
            >
                <form
                    onSubmit={handleAddTask}
                    className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_160px_140px_auto]"
                >
                    <label htmlFor="task-title" className="sr-only">
                        Nova tarefa
                    </label>
                    <Input
                        id="task-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Criar nova tarefa..."
                        title="Criar nova tarefa"
                        aria-label="Criar nova tarefa"
                    />

                    <label htmlFor="task-category" className="sr-only">
                        Categoria
                    </label>
                    <Input
                        id="task-category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        placeholder="Categoria"
                        title="Categoria da tarefa"
                        aria-label="Categoria da tarefa"
                    />

                    <label htmlFor="task-priority" className="sr-only">
                        Prioridade
                    </label>
                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value as Priority)}
                        title="Prioridade da tarefa"
                        aria-label="Prioridade da tarefa"
                        className="ly-input rounded-2xl px-4 py-3"
                    >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>

                    <Button
                        type="submit"
                        size="lg"
                        icon={<Plus size={18} />}
                    >
                        Add
                    </Button>
                </form>

                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                isEditing={editingId === task.id}
                                editingTitle={editingTitle}
                                onEditingTitleChange={setEditingTitle}
                                onStartEdit={startEdit}
                                onSaveEdit={saveEdit}
                                onCancelEdit={cancelEdit}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                            />
                        ))}
                    </AnimatePresence>

                    {filteredTasks.length === 0 && (
                        <EmptyState
                            icon={<ClipboardList size={20} />}
                            title="Nenhuma tarefa encontrada"
                            description="Crie uma nova tarefa ou altere o filtro selecionado para visualizar outros itens."
                        />
                    )}
                </div>
            </SectionCard>
        </div>
    )
}