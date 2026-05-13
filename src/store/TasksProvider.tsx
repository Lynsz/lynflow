import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import type { TaskActivity, ActivityType } from "../types/activity"
import type { Priority, Task } from "../types/task"

const TASKS_KEY = "lynflow-tasks"
const ACTIVITIES_KEY = "lynflow-activities"

type AddTaskData = {
    title: string
    category: string
    priority: Priority
}

type TasksContextValue = {
    isReady: boolean
    tasks: Task[]
    activities: TaskActivity[]
    completedTasks: number
    pendingTasks: number
    highPriorityTasks: number
    productivity: number
    categories: string[]
    addTask: (data: AddTaskData) => void
    updateTask: (id: string, data: Partial<Omit<Task, "id">>) => void
    toggleTask: (id: string) => void
    deleteTask: (id: string) => void
    reorderTasks: (activeId: string, overId: string) => void
    clearTasks: () => void
    resetTasks: () => void
    clearActivities: () => void
}

type TasksProviderProps = {
    children: ReactNode
}

const TasksContext = createContext<TasksContextValue | null>(null)

function createId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID()
    }

    return String(Date.now() + Math.random())
}

function createDemoTasks(): Task[] {
    const now = new Date().toISOString()

    return [
        {
            id: createId(),
            title: "Finalizar layout premium do Lynflow",
            category: "Projeto",
            priority: "high",
            done: false,
            createdAt: now,
            order: 0,
        },
        {
            id: createId(),
            title: "Criar README profissional",
            category: "Portfólio",
            priority: "medium",
            done: false,
            createdAt: now,
            order: 1,
        },
        {
            id: createId(),
            title: "Estudar React Router por 30 minutos",
            category: "Estudos",
            priority: "medium",
            done: true,
            createdAt: now,
            order: 2,
        },
        {
            id: createId(),
            title: "Preparar deploy na Vercel",
            category: "Deploy",
            priority: "high",
            done: false,
            createdAt: now,
            order: 3,
        },
        {
            id: createId(),
            title: "Criar prints para o README",
            category: "Portfólio",
            priority: "low",
            done: false,
            createdAt: now,
            order: 4,
        },
    ]
}

function normalizeTasks(tasks: Partial<Task>[]): Task[] {
    return tasks
        .map((task, index) => ({
            id: task.id ?? createId(),
            title: task.title ?? "Tarefa sem título",
            category: task.category ?? "Geral",
            priority: task.priority ?? "medium",
            done: Boolean(task.done),
            createdAt: task.createdAt ?? new Date().toISOString(),
            order: typeof task.order === "number" ? task.order : index,
        }))
        .sort((a, b) => a.order - b.order)
}

function normalizeActivities(activities: Partial<TaskActivity>[]): TaskActivity[] {
    return activities
        .map((activity) => ({
            id: activity.id ?? createId(),
            type: activity.type ?? "created",
            title: activity.title ?? "Atividade registrada",
            description: activity.description ?? "Uma ação foi registrada no Lynflow.",
            createdAt: activity.createdAt ?? new Date().toISOString(),
        }))
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 30)
}

function reorderArray<T>(items: T[], fromIndex: number, toIndex: number) {
    const result = [...items]
    const [removed] = result.splice(fromIndex, 1)

    result.splice(toIndex, 0, removed)

    return result
}

export function TasksProvider({ children }: TasksProviderProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [activities, setActivities] = useState<TaskActivity[]>([])
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const savedTasks = localStorage.getItem(TASKS_KEY)
        const savedActivities = localStorage.getItem(ACTIVITIES_KEY)

        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks)
                setTasks(normalizeTasks(parsedTasks))
            } catch {
                localStorage.removeItem(TASKS_KEY)
                setTasks(createDemoTasks())
            }
        } else {
            setTasks(createDemoTasks())
        }

        if (savedActivities) {
            try {
                const parsedActivities = JSON.parse(savedActivities)
                setActivities(normalizeActivities(parsedActivities))
            } catch {
                localStorage.removeItem(ACTIVITIES_KEY)
                setActivities([])
            }
        }

        setIsReady(true)
    }, [])

    useEffect(() => {
        if (!isReady) return

        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    }, [tasks, isReady])

    useEffect(() => {
        if (!isReady) return

        localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities))
    }, [activities, isReady])

    const completedTasks = tasks.filter((task) => task.done).length
    const pendingTasks = tasks.filter((task) => !task.done).length

    const highPriorityTasks = tasks.filter(
        (task) => task.priority === "high"
    ).length

    const productivity =
        tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

    const categories = useMemo(() => {
        return Array.from(new Set(tasks.map((task) => task.category)))
    }, [tasks])

    function addActivity(
        type: ActivityType,
        title: string,
        description: string
    ) {
        const newActivity: TaskActivity = {
            id: createId(),
            type,
            title,
            description,
            createdAt: new Date().toISOString(),
        }

        setActivities((currentActivities) =>
            [newActivity, ...currentActivities].slice(0, 30)
        )
    }

    function addTask(data: AddTaskData) {
        if (!data.title.trim()) return

        const smallestOrder =
            tasks.length > 0 ? Math.min(...tasks.map((task) => task.order)) : 0

        const newTask: Task = {
            id: createId(),
            title: data.title.trim(),
            category: data.category.trim() || "Geral",
            priority: data.priority,
            done: false,
            createdAt: new Date().toISOString(),
            order: smallestOrder - 1,
        }

        setTasks((currentTasks) => [newTask, ...currentTasks])

        addActivity(
            "created",
            "Tarefa criada",
            `"${newTask.title}" foi adicionada em ${newTask.category}.`
        )
    }

    function updateTask(id: string, data: Partial<Omit<Task, "id">>) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id ? { ...task, ...data } : task
            )
        )
    }

    function toggleTask(id: string) {
        const task = tasks.find((item) => item.id === id)

        setTasks((currentTasks) =>
            currentTasks.map((taskItem) =>
                taskItem.id === id ? { ...taskItem, done: !taskItem.done } : taskItem
            )
        )

        if (!task) return

        addActivity(
            task.done ? "reopened" : "completed",
            task.done ? "Tarefa reaberta" : "Tarefa concluída",
            `"${task.title}" foi ${task.done ? "reaberta" : "marcada como concluída"}.`
        )
    }

    function deleteTask(id: string) {
        const task = tasks.find((item) => item.id === id)

        setTasks((currentTasks) =>
            currentTasks.filter((taskItem) => taskItem.id !== id)
        )

        if (!task) return

        addActivity(
            "deleted",
            "Tarefa deletada",
            `"${task.title}" foi removida da lista.`
        )
    }

    function reorderTasks(activeId: string, overId: string) {
        if (activeId === overId) return

        setTasks((currentTasks) => {
            const sortedTasks = [...currentTasks].sort((a, b) => a.order - b.order)

            const activeIndex = sortedTasks.findIndex((task) => task.id === activeId)
            const overIndex = sortedTasks.findIndex((task) => task.id === overId)

            if (activeIndex === -1 || overIndex === -1) {
                return currentTasks
            }

            return reorderArray(sortedTasks, activeIndex, overIndex).map(
                (task, index) => ({
                    ...task,
                    order: index,
                })
            )
        })

        addActivity(
            "reordered",
            "Ordem atualizada",
            "A ordem manual das tarefas foi alterada."
        )
    }

    function clearTasks() {
        setTasks([])

        addActivity(
            "cleared",
            "Tarefas limpas",
            "Todas as tarefas locais foram removidas."
        )
    }

    function resetTasks() {
        setTasks(createDemoTasks())

        addActivity(
            "reset",
            "Demo restaurada",
            "As tarefas iniciais do Lynflow foram restauradas."
        )
    }

    function clearActivities() {
        setActivities([])
    }

    const value: TasksContextValue = {
        isReady,
        tasks,
        activities,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        productivity,
        categories,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        reorderTasks,
        clearTasks,
        resetTasks,
        clearActivities,
    }

    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    )
}

export function useTasksContext() {
    const context = useContext(TasksContext)

    if (!context) {
        throw new Error("useTasks deve ser usado dentro de TasksProvider.")
    }

    return context
}