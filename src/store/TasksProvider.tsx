/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../components/ui/ToastProvider"
import { supabase } from "../services/supabase"
import type { TaskActivity, ActivityType } from "../types/activity"
import type { Priority, Task, TaskRecurrence } from "../types/task"
import { mapSupabaseActivity, mapSupabaseTask } from "../types/supabase"
import {
    generateNextRecurringTaskUpdate,
    getTaskRecurrenceLabel,
    normalizeTaskRecurrence,
} from "../utils/taskRecurrence"
import {
    countPresenceDevices,
    getUserRealtimeChannelName,
    getUserRealtimeFilter,
    REALTIME_REFRESH_DELAY_MS,
    type SyncPresencePayload,
} from "../utils/realtime"
import {
    buildRemoteActivityPayload,
    buildRemoteTaskPayload,
    buildRemoteTaskUpdatePayload,
    type RemoteTaskUpdatePayload,
} from "../utils/remoteTaskPayload"
import { getSyncStatus, type SyncStatus } from "../utils/syncStatus"

const TASKS_KEY = "lynflow-tasks"
const ACTIVITIES_KEY = "lynflow-activities"

type AddTaskData = {
    title: string
    category: string
    priority: Priority
    dueDate?: string | null
    recurrence?: TaskRecurrence
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
    syncStatus: SyncStatus
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
    retrySync: () => Promise<void>
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

export function normalizeTasks(tasks: Partial<Task>[]): Task[] {
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
            recurrence: normalizeTaskRecurrence(task.recurrence),
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

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message
    }

    return "Erro inesperado de sincronização."
}

function reorderArray<T>(items: T[], fromIndex: number, toIndex: number) {
    const result = [...items]
    const [removed] = result.splice(fromIndex, 1)

    result.splice(toIndex, 0, removed)

    return result
}

async function fetchRemoteTaskState(userId: string) {
    if (!supabase) {
        return {
            tasks: [],
            activities: [],
        }
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

    return {
        tasks: (tasksResponse.data ?? []).map(mapSupabaseTask),
        activities: (activitiesResponse.data ?? []).map(mapSupabaseActivity),
    }
}

export function TasksProvider({ children }: TasksProviderProps) {
    const { user, dataMode, isLoading: isAuthLoading } = useAuth()
    const { showToast } = useToast()

    const [tasks, setTasks] = useState<Task[]>([])
    const [activities, setActivities] = useState<TaskActivity[]>([])
    const [isReady, setIsReady] = useState(false)
    const [isOnline, setIsOnline] = useState(() =>
        typeof navigator === "undefined" ? true : navigator.onLine
    )
    const [isSyncing, setIsSyncing] = useState(false)
    const [isRealtimeConnected, setIsRealtimeConnected] = useState(false)
    const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
    const [syncError, setSyncError] = useState<string | null>(null)
    const [connectedDevices, setConnectedDevices] = useState(0)
    const remoteRefreshPromiseRef = useRef<Promise<void> | null>(null)
    const pendingRemoteRefreshRef = useRef(false)
    const deviceIdRef = useRef(createId())

    const isRemoteMode = dataMode === "supabase"
    const userId = user?.id

    const refreshRemoteData = useCallback(async () => {
        if (!isRemoteMode || !supabase || !userId) {
            return
        }

        if (remoteRefreshPromiseRef.current) {
            pendingRemoteRefreshRef.current = true
            await remoteRefreshPromiseRef.current
            return
        }

        const runRefresh = async () => {
            do {
                pendingRemoteRefreshRef.current = false
                setIsSyncing(true)
                setSyncError(null)

                try {
                    const remoteState = await fetchRemoteTaskState(userId)

                    setTasks(remoteState.tasks)
                    setActivities(remoteState.activities)
                    setLastSyncedAt(new Date().toISOString())
                } catch (err) {
                    setSyncError(getErrorMessage(err))
                    throw err
                } finally {
                    setIsSyncing(false)
                }
            } while (pendingRemoteRefreshRef.current)
        }

        const refreshPromise = runRefresh().finally(() => {
            remoteRefreshPromiseRef.current = null
        })

        remoteRefreshPromiseRef.current = refreshPromise
        await refreshPromise
    }, [isRemoteMode, userId])

    useEffect(() => {
        function updateOnlineStatus() {
            setIsOnline(navigator.onLine)
        }

        window.addEventListener("online", updateOnlineStatus)
        window.addEventListener("offline", updateOnlineStatus)

        return () => {
            window.removeEventListener("online", updateOnlineStatus)
            window.removeEventListener("offline", updateOnlineStatus)
        }
    }, [])

    useEffect(() => {
        if (isAuthLoading) {
            return
        }

        let isMounted = true

        async function loadData() {
            setIsReady(false)

            if (isRemoteMode) {
                if (!user?.id) {
                    setTasks([])
                    setActivities([])
                    setIsRealtimeConnected(false)
                    setConnectedDevices(0)
                    setSyncError(null)
                    setIsReady(true)
                    return
                }

                try {
                    if (!isMounted) {
                        return
                    }

                    await refreshRemoteData()
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

            setIsRealtimeConnected(false)
            setConnectedDevices(0)
            setLastSyncedAt(null)
            setSyncError(null)
            setIsSyncing(false)

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
    }, [isAuthLoading, isRemoteMode, refreshRemoteData, showToast, user?.id])

    useEffect(() => {
        if (isAuthLoading || !isRemoteMode || !supabase || !userId) {
            return
        }

        const client = supabase
        let isActive = true
        let refreshTimer: ReturnType<typeof window.setTimeout> | null = null

        function updatePresenceCount() {
            const presenceState = channel.presenceState<SyncPresencePayload>()
            setConnectedDevices(countPresenceDevices(presenceState))
        }

        async function refreshRemoteState() {
            try {
                if (!isActive) {
                    return
                }

                await refreshRemoteData()
            } catch (err) {
                if (err instanceof Error && isActive) {
                    showToast({
                        type: "error",
                        title: "Erro ao sincronizar realtime",
                        description: err.message,
                    })
                }
            }
        }

        function scheduleRefresh() {
            if (refreshTimer) {
                window.clearTimeout(refreshTimer)
            }

            refreshTimer = window.setTimeout(() => {
                refreshTimer = null
                void refreshRemoteState()
            }, REALTIME_REFRESH_DELAY_MS)
        }

        const channel = client
            .channel(getUserRealtimeChannelName(userId), {
                config: {
                    presence: {
                        key: deviceIdRef.current,
                    },
                },
            })
            .on("presence", { event: "sync" }, updatePresenceCount)
            .on("presence", { event: "join" }, updatePresenceCount)
            .on("presence", { event: "leave" }, updatePresenceCount)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "tasks",
                    filter: getUserRealtimeFilter(userId),
                },
                scheduleRefresh
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "task_activities",
                    filter: getUserRealtimeFilter(userId),
                },
                scheduleRefresh
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    setIsRealtimeConnected(true)
                    setSyncError(null)

                    const presencePayload: SyncPresencePayload = {
                        userId,
                        deviceId: deviceIdRef.current,
                        onlineAt: new Date().toISOString(),
                    }

                    void channel.track(presencePayload)
                    return
                }

                if (status === "CHANNEL_ERROR") {
                    setIsRealtimeConnected(false)
                    setSyncError("Realtime indisponível.")

                    showToast({
                        type: "warning",
                        title: "Realtime indisponivel",
                        description:
                            "O app continua funcionando e tentara sincronizar nas proximas atualizacoes.",
                    })
                }

                if (status === "TIMED_OUT" || status === "CLOSED") {
                    setIsRealtimeConnected(false)
                }
            })

        return () => {
            isActive = false
            setIsRealtimeConnected(false)
            setConnectedDevices(0)

            if (refreshTimer) {
                window.clearTimeout(refreshTimer)
            }

            void channel.untrack()
            void client.removeChannel(channel)
        }
    }, [isAuthLoading, isRemoteMode, refreshRemoteData, showToast, userId])

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

    const syncStatus = useMemo(
        () =>
            getSyncStatus({
                dataMode,
                isReady,
                userId: user?.id,
                isOnline,
                isRealtimeConnected,
                isSyncing,
                lastSyncedAt,
                errorMessage: syncError,
                connectedDevices,
            }),
        [
            connectedDevices,
            dataMode,
            isOnline,
            isReady,
            isRealtimeConnected,
            isSyncing,
            lastSyncedAt,
            syncError,
            user?.id,
        ]
    )

    async function retrySync() {
        await refreshRemoteData()
    }

    function showRemoteError(error: unknown) {
        const message = getErrorMessage(error)
        setSyncError(message)

        if (error instanceof Error) {
            showToast({
                type: "error",
                title: "Nao foi possivel sincronizar",
                description: message,
            })
        }
    }

    function isMissingRecurrenceColumnError(error: unknown) {
        if (!error || typeof error !== "object") {
            return false
        }

        const message =
            "message" in error && typeof error.message === "string"
                ? error.message.toLowerCase()
                : ""

        return message.includes("recurrence")
    }

    function omitRecurrence<T extends { recurrence?: TaskRecurrence | null }>(
        payload: T
    ): Omit<T, "recurrence"> {
        const fallbackPayload = { ...payload }

        delete fallbackPayload.recurrence

        return fallbackPayload
    }

    async function insertRemoteTasks(
        client: NonNullable<typeof supabase>,
        userId: string,
        tasksToInsert: Task[]
    ) {
        const payload = tasksToInsert.map((task) =>
            buildRemoteTaskPayload(userId, task)
        )

        const { error } = await client.from("tasks").insert(payload)

        if (!error) {
            return
        }

        if (!isMissingRecurrenceColumnError(error)) {
            throw new Error(error.message)
        }

        const fallbackPayload = payload.map(omitRecurrence)
        const { error: fallbackError } = await client
            .from("tasks")
            .insert(fallbackPayload)

        if (fallbackError) {
            throw new Error(fallbackError.message)
        }
    }

    async function updateRemoteTask(
        client: NonNullable<typeof supabase>,
        id: string,
        payload: RemoteTaskUpdatePayload,
        userId: string
    ) {
        const { error } = await client
            .from("tasks")
            .update(payload)
            .eq("id", id)
            .eq("user_id", userId)

        if (!error) {
            return
        }

        if (!isMissingRecurrenceColumnError(error) || !("recurrence" in payload)) {
            throw new Error(error.message)
        }

        const fallbackPayload = omitRecurrence(payload)
        const { error: fallbackError } = await client
            .from("tasks")
            .update(fallbackPayload)
            .eq("id", id)
            .eq("user_id", userId)

        if (fallbackError) {
            throw new Error(fallbackError.message)
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
            .insert(buildRemoteActivityPayload(user.id, type, title, description))
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
            recurrence: normalizeTaskRecurrence(data.recurrence),
            createdAt: new Date().toISOString(),
            order: smallestOrder - 1,
        }

        setTasks((currentTasks) => [newTask, ...currentTasks])

        if (isRemoteMode && supabase && user?.id) {
            const client = supabase
            const userId = user.id

            ; (async () => {
                const payload = buildRemoteTaskPayload(userId, newTask)

                let response = await client
                    .from("tasks")
                    .insert(payload)
                    .select("*")
                    .single()

                if (
                    response.error &&
                    isMissingRecurrenceColumnError(response.error)
                ) {
                    const fallbackPayload = omitRecurrence(payload)

                    response = await client
                        .from("tasks")
                        .insert(fallbackPayload)
                        .select("*")
                        .single()
                }

                if (response.error) {
                    throw new Error(response.error.message)
                }

                setTasks((currentTasks) =>
                    currentTasks.map((task) =>
                        task.id === newTask.id
                            ? mapSupabaseTask(response.data)
                            : task
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

        const payload = buildRemoteTaskUpdatePayload(data)

        const client = supabase
        const userId = user?.id

        ; (async () => {
            if (!userId) return
            await updateRemoteTask(client, id, payload, userId)
        })().catch(showRemoteError)
    }

    function toggleTask(id: string) {
        const task = tasks.find((item) => item.id === id)
        const recurringUpdate =
            task && !task.done ? generateNextRecurringTaskUpdate(task) : null
        const nextTaskData: Partial<Task> = recurringUpdate ?? {
            done: task ? !task.done : true,
        }

        setTasks((currentTasks) =>
            currentTasks.map((taskItem) =>
                taskItem.id === id ? { ...taskItem, ...nextTaskData } : taskItem
            )
        )

        if (!task) return

        if (isRemoteMode && supabase) {
            const client = supabase
            const userId = user?.id

            ; (async () => {
                if (!userId) return
                await updateRemoteTask(
                    client,
                    id,
                    recurringUpdate
                        ? {
                            done: false,
                            due_date: recurringUpdate.dueDate,
                            recurrence: normalizeTaskRecurrence(task.recurrence),
                        }
                        : { done: !task.done },
                    userId
                )
            })().catch(showRemoteError)
        }

        if (recurringUpdate) {
            addActivity(
                "completed",
                "Recorrencia reagendada",
                `"${task.title}" avancou para ${recurringUpdate.dueDate} (${getTaskRecurrenceLabel(
                    normalizeTaskRecurrence(task.recurrence)
                )}).`
            )
            return
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
            const userId = user?.id

            ; (async () => {
                if (!userId) return

                const { error } = await client
                    .from("tasks")
                    .delete()
                    .eq("id", id)
                    .eq("user_id", userId)

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
            const userId = user?.id

            ; (async () => {
                if (!userId) return

                const responses = await Promise.all(
                    reorderedTasks.map((task) =>
                        client
                            .from("tasks")
                            .update({ order_index: task.order })
                            .eq("id", task.id)
                            .eq("user_id", userId)
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
            const userId = user?.id

            ; (async () => {
                if (!userId) return

                const { error } = await client
                    .from("tasks")
                    .delete()
                    .eq("user_id", userId)

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
                    .eq("user_id", userId)

                if (deleteError) {
                    throw deleteError
                }

                await insertRemoteTasks(client, userId, demoTasks)
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
        const userId = user?.id

        ; (async () => {
            if (!userId) return

            const { error } = await client
                .from("task_activities")
                .delete()
                .eq("user_id", userId)

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
                .eq("user_id", userId),
            client
                .from("task_activities")
                .delete()
                .eq("user_id", userId),
        ])

        if (deleteTasksResponse.error) {
            throw deleteTasksResponse.error
        }

        if (deleteActivitiesResponse.error) {
            throw deleteActivitiesResponse.error
        }

        if (importedTasks.length > 0) {
            await insertRemoteTasks(client, userId, importedTasks)
        }

        if (importedActivities.length > 0) {
            const { error } = await client.from("task_activities").insert(
                importedActivities.map((activity) => ({
                    ...buildRemoteActivityPayload(
                        userId,
                        activity.type,
                        activity.title,
                        activity.description
                    ),
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
        syncStatus,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        reorderTasks,
        clearTasks,
        resetTasks,
        clearActivities,
        importBackup,
        retrySync,
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
