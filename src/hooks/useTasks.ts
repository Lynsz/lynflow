import { useTasksContext } from "../store/TasksProvider"

export function useTasks() {
    return useTasksContext()
}