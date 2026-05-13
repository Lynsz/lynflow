import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CompletedTasksCleanup } from "../../src/components/tasks/CompletedTasksCleanup"
import type { Task } from "../../src/types/task"

const deleteTaskMock = vi.fn()
const showToastMock = vi.fn()

vi.mock("../../src/hooks/useTasks", () => ({
    useTasks: () => ({
        tasks: tasksMock,
        deleteTask: deleteTaskMock,
    }),
}))

vi.mock("../../src/components/ui/ToastProvider", () => ({
    useToast: () => ({
        showToast: showToastMock,
    }),
}))

let tasksMock: Task[] = []

function createTask(overrides: Partial<Task>): Task {
    return {
        id: "task-id",
        title: "Tarefa teste",
        category: "Geral",
        priority: "medium",
        done: false,
        createdAt: "2026-05-13T00:00:00.000Z",
        order: 1,
        dueDate: null,
        ...overrides,
    }
}

describe("CompletedTasksCleanup", () => {
    beforeEach(() => {
        tasksMock = []
        deleteTaskMock.mockClear()
        showToastMock.mockClear()
    })

    it("disables cleanup button when there are no completed tasks", () => {
        tasksMock = [
            createTask({
                id: "pending-task",
                title: "Tarefa pendente",
                done: false,
            }),
        ]

        render(<CompletedTasksCleanup />)

        const button = screen.getByRole("button", {
            name: "Limpar tarefas concluídas",
        }) as HTMLButtonElement

        expect(button.disabled).toBe(true)
        expect(screen.getByText("Limpar concluídas (0)")).toBeTruthy()
    })

    it("shows completed tasks count", () => {
        tasksMock = [
            createTask({
                id: "completed-task-1",
                title: "Tarefa concluída 1",
                done: true,
            }),
            createTask({
                id: "completed-task-2",
                title: "Tarefa concluída 2",
                done: true,
            }),
            createTask({
                id: "pending-task",
                title: "Tarefa pendente",
                done: false,
            }),
        ]

        render(<CompletedTasksCleanup />)

        expect(screen.getByText("Limpar concluídas (2)")).toBeTruthy()
    })

    it("opens confirmation dialog before deleting completed tasks", () => {
        tasksMock = [
            createTask({
                id: "completed-task-1",
                title: "Tarefa concluída 1",
                done: true,
            }),
        ]

        render(<CompletedTasksCleanup />)

        fireEvent.click(
            screen.getByRole("button", {
                name: "Limpar tarefas concluídas",
            })
        )

        expect(screen.getByText("Limpar tarefas concluídas?")).toBeTruthy()
        expect(
            screen.getByText(
                "1 tarefa(s) concluída(s) serão removidas permanentemente."
            )
        ).toBeTruthy()
    })

    it("deletes only completed tasks after confirmation", () => {
        tasksMock = [
            createTask({
                id: "completed-task-1",
                title: "Tarefa concluída 1",
                done: true,
            }),
            createTask({
                id: "completed-task-2",
                title: "Tarefa concluída 2",
                done: true,
            }),
            createTask({
                id: "pending-task",
                title: "Tarefa pendente",
                done: false,
            }),
        ]

        render(<CompletedTasksCleanup />)

        fireEvent.click(
            screen.getByRole("button", {
                name: "Limpar tarefas concluídas",
            })
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Limpar concluídas",
            })
        )

        expect(deleteTaskMock).toHaveBeenCalledTimes(2)
        expect(deleteTaskMock).toHaveBeenCalledWith("completed-task-1")
        expect(deleteTaskMock).toHaveBeenCalledWith("completed-task-2")
        expect(deleteTaskMock).not.toHaveBeenCalledWith("pending-task")

        expect(showToastMock).toHaveBeenCalledWith({
            type: "success",
            title: "Tarefas concluídas removidas",
            description: "2 tarefa(s) concluída(s) foram removidas.",
        })
    })
})