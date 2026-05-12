import { create } from "zustand"

type Task = {
  id: number
  title: string
  completed: boolean
}

type TaskStore = {
  tasks: Task[]

  addTask: (title: string) => void
  toggleTask: (id: number) => void
  deleteTask: (id: number) => void
}

export const useTaskStore = create<TaskStore>(
  (set) => ({
    tasks: [],

    addTask: (title) =>
      set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: Date.now(),
            title,
            completed: false,
          },
        ],
      })),

    toggleTask: (id) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
              }
            : task
        ),
      })),

    deleteTask: (id) =>
      set((state) => ({
        tasks: state.tasks.filter(
          (task) => task.id !== id
        ),
      })),
  })
)