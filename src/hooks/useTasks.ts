import { useEffect, useMemo, useState } from "react"
import type { Priority, Task } from "../types/task"

const TASKS_KEY = "lynflow-tasks"

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
    },
    {
        id: createId(),
        title: "Criar README profissional",
        category: "Portfólio",
        priority: "medium",
        done: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: createId(),
        title: "Estudar React Router por 30 minutos",
        category: "Estudos",
        priority: "medium",
        done: true,
        createdAt: new Date().toISOString(),
    },
]

function normalizeTasks(tasks: Partial<Task>[]): Task[] {
    return tasks.map((task) => ({
        id: task.id ?? createId(),
        title: task.title ?? "Tarefa sem título",
        category: task.category ?? "Geral",
        priority: task.priority ?? "medium",
        done: Boolean(task.done),
        createdAt: task.createdAt ?? new Date().toISOString(),
    }))
}

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const savedTasks = localStorage.getItem(TASKS_KEY)

        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks)
            setTasks(normalizeTasks(parsedTasks))
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
    const highPriorityTasks = tasks.filter((task) => task.priority === "high").length

    const productivity =
        tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

    const categories = useMemo(() => {
        return Array.from(new Set(tasks.map((task) => task.category)))
    }, [tasks])

    function addTask(data: {
        title: string
        category: string
        priority: Priority
    }) {
        if (!data.title.trim()) return

        const newTask: Task = {
            id: createId(),
            title: data.title.trim(),
            category: data.category.trim() || "Geral",
            priority: data.priority,
            done: false,
            createdAt: new Date().toISOString(),
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

    function clearTasks() {
        setTasks([])
    }

    return {
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
        clearTasks,
    }
}