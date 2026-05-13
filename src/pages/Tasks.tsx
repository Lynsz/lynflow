import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { useLocation } from "react-router-dom"
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { AnimatePresence } from "framer-motion"
import {
    ArrowUpDown,
    ClipboardList,
    FilterX,
    GripVertical,
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
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { Input } from "../components/ui/Input"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import { SortableTaskItem } from "../components/tasks/SortableTaskItem"
import { TaskKanbanBoard } from "../components/tasks/TaskKanbanBoard"
import { TaskSummaryCards } from "../components/tasks/TaskSummaryCards"
import { useToast } from "../components/ui/ToastProvider"
import { TasksSkeleton } from "../components/skeletons/TasksSkeleton"

type ViewMode = "list" | "kanban"

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
    { key: "manual", label: "Manual" },
    { key: "newest", label: "Mais recentes" },
    { key: "oldest", label: "Mais antigas" },
    { key: "dueDate", label: "Vencimento" },
    { key: "priority", label: "Prioridade" },
    { key: "title", label: "Título A-Z" },
]

export function Tasks() {
    const location = useLocation()
    const titleInputRef = useRef<HTMLInputElement | null>(null)

    const {
        isReady,
        tasks,
        categories,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        reorderTasks,
    } = useTasks()

    const { showToast } = useToast()

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("Geral")
    const [priority, setPriority] = useState<Priority>("medium")
    const [dueDate, setDueDate] = useState("")

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [sortBy, setSortBy] = useState<SortOption>("manual")
    const [viewMode, setViewMode] = useState<ViewMode>("list")

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingTitle, setEditingTitle] = useState("")
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

    useEffect(() => {
        function focusNewTaskInput() {
            titleInputRef.current?.focus()
        }

        window.addEventListener("lynflow-focus-new-task", focusNewTaskInput)

        return () => {
            window.removeEventListener("lynflow-focus-new-task", focusNewTaskInput)
        }
    }, [])

    useEffect(() => {
        if (!isReady) return

        const state = location.state as
            | {
                focusNewTask?: boolean
                shortcutAt?: number
            }
            | null

        if (state?.focusNewTask) {
            window.setTimeout(() => {
                titleInputRef.current?.focus()
            }, 80)
        }
    }, [isReady, location.state])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

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
        sortBy !== "manual"

    const isDragDisabled = sortBy !== "manual" || viewMode !== "list"

    if (!isReady) {
        return <TasksSkeleton />
    }

    function handleAddTask(event: FormEvent<HTMLFormElement>) {
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
            dueDate: dueDate || null,
        })

        showToast({
            type: "success",
            title: "Tarefa criada",
            description: `"${title.trim()}" foi adicionada.`,
        })

        setTitle("")
        setCategory("Geral")
        setPriority("medium")
        setDueDate("")

        window.setTimeout(() => {
            titleInputRef.current?.focus()
        }, 50)
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

    function requestDeleteTask(id: string) {
        const task = tasks.find((item) => item.id === id)

        if (!task) return

        setTaskToDelete(task)
    }

    function confirmDeleteTask() {
        if (!taskToDelete) return

        deleteTask(taskToDelete.id)

        showToast({
            type: "success",
            title: "Tarefa deletada",
            description: taskToDelete.title,
        })

        setTaskToDelete(null)
    }

    function clearFilters() {
        setSearch("")
        setStatusFilter("all")
        setPriorityFilter("all")
        setCategoryFilter("all")
        setSortBy("manual")

        showToast({
            type: "info",
            title: "Filtros limpos",
            description: "A lista voltou para a visualização padrão.",
        })
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over || active.id === over.id) return

        reorderTasks(String(active.id), String(over.id))

        showToast({
            type: "success",
            title: "Ordem atualizada",
            description: "A nova ordem das tarefas foi salva.",
        })
    }

    function handleChangeViewMode(nextViewMode: ViewMode) {
        setViewMode(nextViewMode)

        showToast({
            type: "info",
            title:
                nextViewMode === "kanban"
                    ? "Visualização Kanban ativada"
                    : "Visualização em lista ativada",
            description:
                nextViewMode === "kanban"
                    ? "As tarefas agora aparecem organizadas por status."
                    : "As tarefas voltaram para a lista com drag and drop.",
        })
    }

    return (
        <>
            <div className="ly-page px-4 py-6 md:px-8">
                <PageHeader
                    eyebrow="Task system"
                    title="Tasks"
                    description="Crie, organize, edite e conclua tarefas com prioridade, categoria, busca, filtros, Kanban e drag and drop."
                />

                <SectionCard
                    title="Nova tarefa"
                    description="Adicione uma tarefa com categoria, prioridade e vencimento."
                >
                    <form
                        onSubmit={handleAddTask}
                        className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_160px_140px_160px_auto]"
                    >
                        <label htmlFor="task-title" className="sr-only">
                            Nova tarefa
                        </label>

                        <Input
                            ref={titleInputRef}
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
                            onChange={(event) =>
                                setPriority(event.target.value as Priority)
                            }
                            title="Prioridade da tarefa"
                            aria-label="Prioridade da tarefa"
                            className="ly-input rounded-2xl px-4 py-3"
                        >
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                        </select>

                        <label htmlFor="task-due-date" className="sr-only">
                            Vencimento
                        </label>

                        <Input
                            id="task-due-date"
                            type="date"
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                            title="Data de vencimento"
                            aria-label="Data de vencimento"
                        />

                        <Button type="submit" size="lg" icon={<Plus size={18} />}>
                            Add
                        </Button>
                    </form>
                </SectionCard>

                <div className="mt-6">
                    <TaskSummaryCards tasks={tasks} />
                </div>

                <SectionCard
                    className="mt-6"
                    title="Filtros"
                    description="Encontre tarefas por texto, status, prioridade, categoria, ordenação e visualização."
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

                    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium">Visualização</p>

                            <p className="ly-muted-soft text-sm">
                                Use lista para reordenar manualmente ou Kanban para
                                analisar o fluxo.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={viewMode === "list" ? "primary" : "secondary"}
                                size="sm"
                                icon={<ClipboardList size={16} />}
                                onClick={() => handleChangeViewMode("list")}
                            >
                                Lista
                            </Button>

                            <Button
                                variant={viewMode === "kanban" ? "primary" : "secondary"}
                                size="sm"
                                icon={<SlidersHorizontal size={16} />}
                                onClick={() => handleChangeViewMode("kanban")}
                            >
                                Kanban
                            </Button>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    className="mt-6"
                    title={viewMode === "kanban" ? "Kanban de tarefas" : "Lista de tarefas"}
                    description={
                        viewMode === "kanban"
                            ? `${filteredTasks.length} de ${tasks.length} tarefa(s) exibida(s), separadas entre atrasadas, pendentes e concluídas.`
                            : `${filteredTasks.length} de ${tasks.length} tarefa(s) exibida(s). Use Manual para arrastar e reordenar.`
                    }
                    action={
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                            <GripVertical size={16} />

                            <span>
                                {isDragDisabled ? "Drag desativado" : "Drag ativo"}
                            </span>

                            <SlidersHorizontal size={16} />

                            <span>{hasActiveFilters ? "Filtros ativos" : "Sem filtros"}</span>

                            <ArrowUpDown size={16} />
                        </div>
                    }
                >
                    {viewMode === "kanban" ? (
                        <TaskKanbanBoard
                            tasks={filteredTasks}
                            editingId={editingId}
                            editingTitle={editingTitle}
                            onEditingTitleChange={setEditingTitle}
                            onStartEdit={startEdit}
                            onSaveEdit={saveEdit}
                            onCancelEdit={cancelEdit}
                            onToggle={handleToggleTask}
                            onDelete={requestDeleteTask}
                        />
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={filteredTasks.map((task) => task.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {filteredTasks.map((task) => (
                                            <SortableTaskItem
                                                key={task.id}
                                                task={task}
                                                isEditing={editingId === task.id}
                                                editingTitle={editingTitle}
                                                onEditingTitleChange={setEditingTitle}
                                                onStartEdit={startEdit}
                                                onSaveEdit={saveEdit}
                                                onCancelEdit={cancelEdit}
                                                onToggle={handleToggleTask}
                                                onDelete={requestDeleteTask}
                                                disabled={isDragDisabled}
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
                            </SortableContext>
                        </DndContext>
                    )}
                </SectionCard>
            </div>

            <ConfirmDialog
                isOpen={!!taskToDelete}
                title="Deletar tarefa?"
                description={
                    taskToDelete
                        ? `A tarefa "${taskToDelete.title}" será removida permanentemente da lista.`
                        : "Essa tarefa será removida permanentemente."
                }
                confirmLabel="Deletar"
                cancelLabel="Cancelar"
                variant="danger"
                onConfirm={confirmDeleteTask}
                onClose={() => setTaskToDelete(null)}
            />
        </>
    )
}