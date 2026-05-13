import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import type { Priority, Task } from "../types/task"

const TASKS_KEY = "lynflow-tasks"

type AddTaskData = {
    title: string
    category: string
    priority: Priority
}

type TasksContextValue = {
    isReady: boolean
    tasks: Task[]
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

const initialTasks: Task[] = [
    {
        id: createId(),
        title: "Finalizar layout premium do Lynflow",
        category: "Projeto",
        priority: "high",
        done: false,
        createdAt: new Date().toISOString(),
        order: 0,
    },
    {
        id: createId(),
        title: "Criar README profissional",
        category: "Portfólio",
        priority: "medium",
        done: false,
        createdAt: new Date().toISOString(),
        order: 1,
    },
    {
        id: createId(),
        title: "Estudar React Router por 30 minutos",
        category: "Estudos",
        priority: "medium",
        done: true,
        createdAt: new Date().toISOString(),
        order: 2,
    },
]

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

function reorderArray<T>(items: T[], fromIndex: number, toIndex: number) {
    const result = [...items]
    const [removed] = result.splice(fromIndex, 1)

    result.splice(toIndex, 0, removed)

    return result
}

export function TasksProvider({ children }: TasksProviderProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const savedTasks = localStorage.getItem(TASKS_KEY)

        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks)
                setTasks(normalizeTasks(parsedTasks))
            } catch {
                localStorage.removeItem(TASKS_KEY)
                setTasks(initialTasks)
            }
        } else {
            setTasks(initialTasks)
        }

        setIsReady(true)
    }, [])

    useEffect(() => {
        if (!isReady) return

        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    }, [tasks, isReady])

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
    }

    function updateTask(id: string, data: Partial<Omit<Task, "id">>) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id ? { ...task, ...data } : task
            )
        )
    }

    function toggleTask(id: string) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id ? { ...task, done: !task.done } : task
            )
        )
    }

    function deleteTask(id: string) {
        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== id)
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
    }

    function clearTasks() {
        setTasks([])
    }

    const value: TasksContextValue = {
        isReady,
        tasks,
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