import { create } from "zustand"

type Task = {
    id: string
    title: string
    completed: boolean
}

type TaskStore = {
    tasks: Task[]
    setTasks: (tasks: Task[]) => void
}

export const useTaskStore = create<TaskStore>(
    (set) => ({
        tasks: [],

        setTasks: (tasks) => set({ tasks }),
    })
)