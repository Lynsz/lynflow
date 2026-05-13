/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../components/ui/ToastProvider"
import { supabase } from "../services/supabase"
import type { TaskActivity, ActivityType } from "../types/activity"
import type { Priority, Task } from "../types/task"
import { mapSupabaseActivity, mapSupabaseTask } from "../types/supabase"

const TASKS_KEY = "lynflow-tasks"
const ACTIVITIES_KEY = "lynflow-activities"

type AddTaskData = {
    title: string
    category: string
    priority: Priority
    dueDate?: string | null
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
    importBackup: (data: {
        tasks: Task[]
        activities: TaskActivity[]
    }) => Promise<void>
}

type TasksProviderProps = {
    children: ReactNode
}

const TasksContext = createContext<TasksContextValue | null>(null)

const validPriorities: Priority[] = ["low", "medium", "high"]

const validActivityTypes: ActivityType[] = [
    "created",
    "completed",
    "reopened",
    "deleted",
    "reordered",
    "cleared",
    "reset",
]

function createId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID()
    }

    return String(Date.now() + Math.random())
}

function isValidPriority(priority: unknown): priority is Priority {
    return typeof priority === "string" && validPriorities.includes(priority as Priority)
}

function isValidActivityType(type: unknown): type is ActivityType {
    return (
        typeof type === "string" &&
        validActivityTypes.includes(type as ActivityType)
    )
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
            category: "Portfolio",
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
            category: "Portfolio",
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
            id: typeof task.id === "string" ? task.id : createId(),
            title:
                typeof task.title === "string" && task.title.trim()
                    ? task.title
                    : "Tarefa sem titulo",
            category:
                typeof task.category === "string" && task.category.trim()
                    ? task.category
                    : "Geral",
            priority: isValidPriority(task.priority) ? task.priority : "medium",
            done: Boolean(task.done),
            dueDate:
                typeof task.dueDate === "string" && task.dueDate.trim()
                    ? task.dueDate
                    : null,
            createdAt:
                typeof task.createdAt === "string"
                    ? task.createdAt
                    : new Date().toISOString(),
            order: typeof task.order === "number" ? task.order : index,
        }))
        .sort((a, b) => a.order - b.order)
}

function normalizeActivities(
    activities: Partial<TaskActivity>[]
): TaskActivity[] {
    return activities
        .map((activity) => ({
            id: typeof activity.id === "string" ? activity.id : createId(),
            type: isValidActivityType(activity.type) ? activity.type : "created",
            title:
                typeof activity.title === "string" && activity.title.trim()
                    ? activity.title
                    : "Atividade registrada",
            description:
                typeof activity.description === "string" && activity.description.trim()
                    ? activity.description
                    : "Uma acao foi registrada no Lynflow.",
            createdAt:
                typeof activity.createdAt === "string"
                    ? activity.createdAt
                    : new Date().toISOString(),
        }))
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 30)
}

function parseStoredArray<T>(value: string | null): T[] | null {
    if (!value) return null

    try {
        const parsedValue = JSON.parse(value)

        if (!Array.isArray(parsedValue)) {
            return null
        }

        return parsedValue as T[]
    } catch {
        return null
    }
}

function reorderArray<T>(items: T[], fromIndex: number, toIndex: number) {
    const result = [...items]
    const [removed] = result.splice(fromIndex, 1)

    result.splice(toIndex, 0, removed)

    return result
}

export function TasksProvider({ children }: TasksProviderProps) {
    const { user, dataMode, isLoading: isAuthLoading } = useAuth()
    const { showToast } = useToast()

    const [tasks, setTasks] = useState<Task[]>([])
    const [activities, setActivities] = useState<TaskActivity[]>([])
    const [isReady, setIsReady] = useState(false)

    const isRemoteMode = dataMode === "supabase"

    useEffect(() => {
        if (isAuthLoading) {
            return
        }

        let isMounted = true

        async function loadRemoteData(userId: string) {
            if (!supabase) {
                return
            }

            const [tasksResponse, activitiesResponse] = await Promise.all([
                supabase
                    .from("tasks")
                    .select("*")
                    .eq("user_id", userId)
                    .order("order_index", { ascending: true }),
                supabase
                    .from("task_activities")
                    .select("*")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false })
                    .limit(30),
            ])

            if (tasksResponse.error) {
                throw tasksResponse.error
            }

            if (activitiesResponse.error) {
                throw activitiesResponse.error
            }

            if (!isMounted) {
                return
            }

            setTasks(tasksResponse.data.map(mapSupabaseTask))
            setActivities(activitiesResponse.data.map(mapSupabaseActivity))
        }

        async function loadData() {
            setIsReady(false)

            if (isRemoteMode) {
                if (!user?.id) {
                    setTasks([])
                    setActivities([])
                    setIsReady(true)
                    return
                }

                try {
                    await loadRemoteData(user.id)
                } catch (err) {
                    if (err instanceof Error) {
                        showToast({
                            type: "error",
                            title: "Erro ao carregar dados",
                            description: err.message,
                        })
                    }
                } finally {
                    if (isMounted) {
                        setIsReady(true)
                    }
                }

                return
            }

            const parsedTasks = parseStoredArray<Partial<Task>>(
                localStorage.getItem(TASKS_KEY)
            )

            const parsedActivities = parseStoredArray<Partial<TaskActivity>>(
                localStorage.getItem(ACTIVITIES_KEY)
            )

            if (parsedTasks) {
                setTasks(normalizeTasks(parsedTasks))
            } else {
                localStorage.removeItem(TASKS_KEY)
                setTasks(createDemoTasks())
            }

            if (parsedActivities) {
                setActivities(normalizeActivities(parsedActivities))
            } else {
                localStorage.removeItem(ACTIVITIES_KEY)
                setActivities([])
            }

            setIsReady(true)
        }

        loadData()

        return () => {
            isMounted = false
        }
    }, [isAuthLoading, isRemoteMode, showToast, user?.id])

    useEffect(() => {
        if (!isReady || isRemoteMode) return

        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    }, [tasks, isReady, isRemoteMode])

    useEffect(() => {
        if (!isReady || isRemoteMode) return

        localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities))
    }, [activities, isReady, isRemoteMode])

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

    function showRemoteError(error: unknown) {
        if (error instanceof Error) {
            showToast({
                type: "error",
                title: "Nao foi possivel sincronizar",
                description: error.message,
            })
        }
    }

    async function persistActivity(
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

        if (!isRemoteMode || !supabase || !user?.id) {
            return
        }

        const { data, error } = await supabase
            .from("task_activities")
            .insert({
                user_id: user.id,
                type,
                title,
                description,
            })
            .select("*")
            .single()

        if (error) {
            throw error
        }

        setActivities((currentActivities) =>
            [mapSupabaseActivity(data), ...currentActivities.filter((item) => item.id !== newActivity.id)].slice(0, 30)
        )
    }

    function addActivity(
        type: ActivityType,
        title: string,
        description: string
    ) {
        persistActivity(type, title, description).catch(showRemoteError)
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
            dueDate: data.dueDate || null,
            createdAt: new Date().toISOString(),
            order: smallestOrder - 1,
        }

        setTasks((currentTasks) => [newTask, ...currentTasks])

        if (isRemoteMode && supabase && user?.id) {
            const client = supabase
            const userId = user.id

            ; (async () => {
                const { data: insertedTask, error } = await client
                    .from("tasks")
                    .insert({
                        user_id: userId,
                        title: newTask.title,
                        category: newTask.category,
                        priority: newTask.priority,
                        done: newTask.done,
                        due_date: newTask.dueDate ?? null,
                        order_index: newTask.order,
                    })
                    .select("*")
                    .single()

                if (error) {
                    throw error
                }

                setTasks((currentTasks) =>
                    currentTasks.map((task) =>
                        task.id === newTask.id ? mapSupabaseTask(insertedTask) : task
                    )
                )
            })().catch(showRemoteError)
        }

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

        if (!isRemoteMode || !supabase) {
            return
        }

        const payload: {
            title?: string
            category?: string
            priority?: Priority
            done?: boolean
            order_index?: number
            due_date?: string | null
        } = {}

        if (typeof data.title === "string") payload.title = data.title
        if (typeof data.category === "string") payload.category = data.category
        if (data.priority) payload.priority = data.priority
        if (typeof data.done === "boolean") payload.done = data.done
        if (typeof data.order === "number") payload.order_index = data.order
        if (typeof data.dueDate === "string" || data.dueDate === null) {
            payload.due_date = data.dueDate
        }

        const client = supabase

        ; (async () => {
            const { error } = await client.from("tasks").update(payload).eq("id", id)

            if (error) {
                throw error
            }
        })().catch(showRemoteError)
    }

    function toggleTask(id: string) {
        const task = tasks.find((item) => item.id === id)

        setTasks((currentTasks) =>
            currentTasks.map((taskItem) =>
                taskItem.id === id ? { ...taskItem, done: !taskItem.done } : taskItem
            )
        )

        if (!task) return

        if (isRemoteMode && supabase) {
            const client = supabase

            ; (async () => {
                const { error } = await client
                    .from("tasks")
                    .update({ done: !task.done })
                    .eq("id", id)

                if (error) {
                    throw error
                }
            })().catch(showRemoteError)
        }

        addActivity(
            task.done ? "reopened" : "completed",
            task.done ? "Tarefa reaberta" : "Tarefa concluida",
            `"${task.title}" foi ${task.done ? "reaberta" : "marcada como concluida"}.`
        )
    }

    function deleteTask(id: string) {
        const task = tasks.find((item) => item.id === id)

        setTasks((currentTasks) =>
            currentTasks.filter((taskItem) => taskItem.id !== id)
        )

        if (isRemoteMode && supabase) {
            const client = supabase

            ; (async () => {
                const { error } = await client.from("tasks").delete().eq("id", id)

                if (error) {
                    throw error
                }
            })().catch(showRemoteError)
        }

        if (!task) return

        addActivity(
            "deleted",
            "Tarefa deletada",
            `"${task.title}" foi removida da lista.`
        )
    }

    function reorderTasks(activeId: string, overId: string) {
        if (activeId === overId) return

        let reorderedTasks: Task[] = []

        setTasks((currentTasks) => {
            const sortedTasks = [...currentTasks].sort((a, b) => a.order - b.order)

            const activeIndex = sortedTasks.findIndex((task) => task.id === activeId)
            const overIndex = sortedTasks.findIndex((task) => task.id === overId)

            if (activeIndex === -1 || overIndex === -1) {
                return currentTasks
            }

            reorderedTasks = reorderArray(sortedTasks, activeIndex, overIndex).map(
                (task, index) => ({
                    ...task,
                    order: index,
                })
            )

            return reorderedTasks
        })

        if (isRemoteMode && supabase) {
            const client = supabase

            ; (async () => {
                const responses = await Promise.all(
                    reorderedTasks.map((task) =>
                        client
                            .from("tasks")
                            .update({ order_index: task.order })
                            .eq("id", task.id)
                    )
                )

                const failedResponse = responses.find((response) => response.error)

                if (failedResponse?.error) {
                    throw failedResponse.error
                }
            })().catch(showRemoteError)
        }

        addActivity(
            "reordered",
            "Ordem atualizada",
            "A ordem manual das tarefas foi alterada."
        )
    }

    function clearTasks() {
        setTasks([])

        if (isRemoteMode && supabase) {
            const client = supabase

            ; (async () => {
                const { error } = await client
                    .from("tasks")
                    .delete()
                    .neq("id", "00000000-0000-0000-0000-000000000000")

                if (error) {
                    throw error
                }
            })().catch(showRemoteError)
        }

        addActivity(
            "cleared",
            "Tarefas limpas",
            isRemoteMode
                ? "Todas as tarefas sincronizadas foram removidas."
                : "Todas as tarefas locais foram removidas."
        )
    }

    function resetTasks() {
        const demoTasks = createDemoTasks()

        setTasks(demoTasks)

        if (isRemoteMode && supabase && user?.id) {
            const client = supabase
            const userId = user.id

            ; (async () => {
                const { error: deleteError } = await client
                    .from("tasks")
                    .delete()
                    .neq("id", "00000000-0000-0000-0000-000000000000")

                if (deleteError) {
                    throw deleteError
                }

                const { error: insertError } = await client.from("tasks").insert(
                    demoTasks.map((task) => ({
                        user_id: userId,
                        title: task.title,
                        category: task.category,
                        priority: task.priority,
                        done: task.done,
                        due_date: task.dueDate ?? null,
                        order_index: task.order,
                    }))
                )

                if (insertError) {
                    throw insertError
                }
            })().catch(showRemoteError)
        }

        addActivity(
            "reset",
            "Demo restaurada",
            "As tarefas iniciais do Lynflow foram restauradas."
        )
    }

    function clearActivities() {
        setActivities([])

        if (!isRemoteMode || !supabase) {
            return
        }

        const client = supabase

        ; (async () => {
            const { error } = await client
                .from("task_activities")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000")

            if (error) {
                throw error
            }
        })().catch(showRemoteError)
    }

    async function importBackup(data: {
        tasks: Task[]
        activities: TaskActivity[]
    }) {
        const importedTasks = normalizeTasks(data.tasks)
        const importedActivities = normalizeActivities(data.activities)

        setTasks(importedTasks)
        setActivities(importedActivities)

        if (!isRemoteMode || !supabase || !user?.id) {
            return
        }

        const client = supabase
        const userId = user.id

        const [deleteTasksResponse, deleteActivitiesResponse] = await Promise.all([
            client
                .from("tasks")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000"),
            client
                .from("task_activities")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000"),
        ])

        if (deleteTasksResponse.error) {
            throw deleteTasksResponse.error
        }

        if (deleteActivitiesResponse.error) {
            throw deleteActivitiesResponse.error
        }

        if (importedTasks.length > 0) {
            const { error } = await client.from("tasks").insert(
                importedTasks.map((task) => ({
                    user_id: userId,
                    title: task.title,
                    category: task.category,
                    priority: task.priority,
                    done: task.done,
                    due_date: task.dueDate ?? null,
                    order_index: task.order,
                }))
            )

            if (error) {
                throw error
            }
        }

        if (importedActivities.length > 0) {
            const { error } = await client.from("task_activities").insert(
                importedActivities.map((activity) => ({
                    user_id: userId,
                    type: activity.type,
                    title: activity.title,
                    description: activity.description,
                }))
            )

            if (error) {
                throw error
            }
        }
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
        importBackup,
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
