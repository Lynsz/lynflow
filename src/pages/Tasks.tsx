import { useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import {
    ArrowUpDown,
    ClipboardList,
    FilterX,
    Plus,
    Search,
    SlidersHorizontal,
} from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import type { Priority, Task } from "../types/task"
import {
    filterAndSortTasks,
    type PriorityFilter,
    type SortOption,
    type StatusFilter,
} from "../utils/taskFilters"
import { Button } from "../components/ui/Button"
import { EmptyState } from "../components/ui/EmptyState"
import { Input } from "../components/ui/Input"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import { TaskCard } from "../components/tasks/TaskCard"
import { useToast } from "../components/ui/ToastProvider"

const statusFilters: Array<{ key: StatusFilter; label: string }> = [
    { key: "all", label: "Todas" },
    { key: "todo", label: "Pendentes" },
    { key: "done", label: "Concluídas" },
]

const priorityOptions: Array<{ key: PriorityFilter; label: string }> = [
    { key: "all", label: "Todas" },
    { key: "high", label: "Alta" },
    { key: "medium", label: "Média" },
    { key: "low", label: "Baixa" },
]

const sortOptions: Array<{ key: SortOption; label: string }> = [
    { key: "newest", label: "Mais recentes" },
    { key: "oldest", label: "Mais antigas" },
    { key: "priority", label: "Prioridade" },
    { key: "title", label: "Título A-Z" },
]

export function Tasks() {
    const {
        tasks,
        categories,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
    } = useTasks()

    const { showToast } = useToast()

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("Geral")
    const [priority, setPriority] = useState<Priority>("medium")

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const [priorityFilter, setPriorityFilter] =
        useState<PriorityFilter>("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [sortBy, setSortBy] = useState<SortOption>("newest")

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingTitle, setEditingTitle] = useState("")

    const filteredTasks = useMemo(() => {
        return filterAndSortTasks({
            tasks,
            search,
            status: statusFilter,
            priority: priorityFilter,
            category: categoryFilter,
            sortBy,
        })
    }, [tasks, search, statusFilter, priorityFilter, categoryFilter, sortBy])

    const hasActiveFilters =
        search.trim() !== "" ||
        statusFilter !== "all" ||
        priorityFilter !== "all" ||
        categoryFilter !== "all" ||
        sortBy !== "newest"

    function handleAddTask(event: React.FormEvent) {
        event.preventDefault()

        if (!title.trim()) {
            showToast({
                type: "warning",
                title: "Tarefa vazia",
                description: "Digite um título antes de adicionar.",
            })

            return
        }

        addTask({
            title,
            category,
            priority,
        })

        showToast({
            type: "success",
            title: "Tarefa criada",
            description: `"${title.trim()}" foi adicionada.`,
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

            showToast({
                type: "warning",
                title: "Edição cancelada",
                description: "O título da tarefa não pode ficar vazio.",
            })

            return
        }

        updateTask(id, {
            title: editingTitle.trim(),
        })

        showToast({
            type: "success",
            title: "Tarefa atualizada",
            description: "O título da tarefa foi editado.",
        })

        setEditingId(null)
        setEditingTitle("")
    }

    function cancelEdit() {
        setEditingId(null)
        setEditingTitle("")

        showToast({
            type: "info",
            title: "Edição cancelada",
        })
    }

    function handleToggleTask(id: string) {
        const task = tasks.find((item) => item.id === id)

        toggleTask(id)

        showToast({
            type: "success",
            title: task?.done ? "Tarefa reaberta" : "Tarefa concluída",
            description: task?.title,
        })
    }

    function handleDeleteTask(id: string) {
        const task = tasks.find((item) => item.id === id)

        deleteTask(id)

        showToast({
            type: "success",
            title: "Tarefa deletada",
            description: task?.title,
        })
    }

    function clearFilters() {
        setSearch("")
        setStatusFilter("all")
        setPriorityFilter("all")
        setCategoryFilter("all")
        setSortBy("newest")

        showToast({
            type: "info",
            title: "Filtros limpos",
            description: "A lista voltou para a visualização padrão.",
        })
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="Task system"
                title="Tasks"
                description="Crie, organize, edite e conclua tarefas com prioridade, categoria, busca e filtros."
            />

            <SectionCard
                title="Nova tarefa"
                description="Adicione uma tarefa com categoria e prioridade."
            >
                <form
                    onSubmit={handleAddTask}
                    className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_160px_140px_auto]"
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

                    <Button type="submit" size="lg" icon={<Plus size={18} />}>
                        Add
                    </Button>
                </form>
            </SectionCard>

            <SectionCard
                className="mt-6"
                title="Filtros"
                description="Encontre tarefas por texto, status, prioridade, categoria e ordenação."
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
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_180px_180px_180px_180px]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-soft)]"
                        />

                        <label htmlFor="task-search" className="sr-only">
                            Buscar tarefa
                        </label>
                        <Input
                            id="task-search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar por título ou categoria..."
                            title="Buscar tarefa"
                            aria-label="Buscar tarefa"
                            className="pl-11"
                        />
                    </div>

                    <div>
                        <label htmlFor="status-filter" className="sr-only">
                            Filtrar por status
                        </label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value as StatusFilter)
                            }
                            title="Filtrar por status"
                            aria-label="Filtrar por status"
                            className="ly-input rounded-2xl px-4 py-3"
                        >
                            {statusFilters.map((item) => (
                                <option key={item.key} value={item.key}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="priority-filter" className="sr-only">
                            Filtrar por prioridade
                        </label>
                        <select
                            id="priority-filter"
                            value={priorityFilter}
                            onChange={(event) =>
                                setPriorityFilter(event.target.value as PriorityFilter)
                            }
                            title="Filtrar por prioridade"
                            aria-label="Filtrar por prioridade"
                            className="ly-input rounded-2xl px-4 py-3"
                        >
                            {priorityOptions.map((item) => (
                                <option key={item.key} value={item.key}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="category-filter" className="sr-only">
                            Filtrar por categoria
                        </label>
                        <select
                            id="category-filter"
                            value={categoryFilter}
                            onChange={(event) => setCategoryFilter(event.target.value)}
                            title="Filtrar por categoria"
                            aria-label="Filtrar por categoria"
                            className="ly-input rounded-2xl px-4 py-3"
                        >
                            <option value="all">Categorias</option>

                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="task-sort" className="sr-only">
                            Ordenar tarefas
                        </label>
                        <select
                            id="task-sort"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value as SortOption)
                            }
                            title="Ordenar tarefas"
                            aria-label="Ordenar tarefas"
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
                title="Lista de tarefas"
                description={`${filteredTasks.length} de ${tasks.length} tarefa(s) exibida(s). Clique duas vezes no título para editar.`}
                action={
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <SlidersHorizontal size={16} />
                        <span>{hasActiveFilters ? "Filtros ativos" : "Sem filtros"}</span>
                        <ArrowUpDown size={16} />
                    </div>
                }
            >
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
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </AnimatePresence>

                    {filteredTasks.length === 0 && (
                        <EmptyState
                            icon={<ClipboardList size={20} />}
                            title="Nenhuma tarefa encontrada"
                            description="Ajuste a busca ou limpe os filtros para visualizar outros itens."
                        />
                    )}
                </div>
            </SectionCard>
        </div>
    )
}