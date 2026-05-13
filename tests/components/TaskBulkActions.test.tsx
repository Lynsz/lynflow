import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { TaskBulkActions } from "../../src/components/tasks/TaskBulkActions"
import type { Task } from "../../src/types/task"

const mocks = vi.hoisted(() => ({
    deleteTask: vi.fn(),
    toggleTask: vi.fn(),
    showToast: vi.fn(),
}))

vi.mock("../../src/hooks/useTasks", () => ({
    useTasks: () => ({
        deleteTask: mocks.deleteTask,
        toggleTask: mocks.toggleTask,
    }),
}))

vi.mock("../../src/components/ui/ToastProvider", () => ({
    useToast: () => ({
        showToast: mocks.showToast,
    }),
}))

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

describe("TaskBulkActions", () => {
    beforeEach(() => {
        mocks.deleteTask.mockClear()
        mocks.toggleTask.mockClear()
        mocks.showToast.mockClear()
    })

    it("disables actions when there are no visible tasks", () => {
        render(<TaskBulkActions visibleTasks={[]} />)

        const completeButton = screen.getByRole("button", {
            name: "Marcar tarefas visíveis como concluídas",
        }) as HTMLButtonElement

        const deleteButton = screen.getByRole("button", {
            name: "Deletar tarefas visíveis",
        }) as HTMLButtonElement

        expect(completeButton.disabled).toBe(true)
        expect(deleteButton.disabled).toBe(true)
        expect(screen.getByText("Concluir visíveis (0)")).toBeTruthy()
        expect(screen.getByText("Deletar visíveis (0)")).toBeTruthy()
    })

    it("disables complete button when all visible tasks are already completed", () => {
        render(
            <TaskBulkActions
                visibleTasks={[
                    createTask({
                        id: "completed-task",
                        title: "Tarefa concluída",
                        done: true,
                    }),
                ]}
            />
        )

        const completeButton = screen.getByRole("button", {
            name: "Marcar tarefas visíveis como concluídas",
        }) as HTMLButtonElement

        const deleteButton = screen.getByRole("button", {
            name: "Deletar tarefas visíveis",
        }) as HTMLButtonElement

        expect(completeButton.disabled).toBe(true)
        expect(deleteButton.disabled).toBe(false)
        expect(screen.getByText("Concluir visíveis (0)")).toBeTruthy()
        expect(screen.getByText("Deletar visíveis (1)")).toBeTruthy()
    })

    it("marks only pending visible tasks as completed", () => {
        render(
            <TaskBulkActions
                visibleTasks={[
                    createTask({
                        id: "pending-task-1",
                        title: "Tarefa pendente 1",
                        done: false,
                    }),
                    createTask({
                        id: "pending-task-2",
                        title: "Tarefa pendente 2",
                        done: false,
                    }),
                    createTask({
                        id: "completed-task",
                        title: "Tarefa concluída",
                        done: true,
                    }),
                ]}
            />
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Marcar tarefas visíveis como concluídas",
            })
        )

        expect(mocks.toggleTask).toHaveBeenCalledTimes(2)
        expect(mocks.toggleTask).toHaveBeenCalledWith("pending-task-1")
        expect(mocks.toggleTask).toHaveBeenCalledWith("pending-task-2")
        expect(mocks.toggleTask).not.toHaveBeenCalledWith("completed-task")

        expect(mocks.showToast).toHaveBeenCalledWith({
            type: "success",
            title: "Tarefas visíveis concluídas",
            description:
                "2 tarefa(s) visível(is) foram marcadas como concluídas.",
        })
    })

    it("opens confirmation dialog before deleting visible tasks", () => {
        render(
            <TaskBulkActions
                visibleTasks={[
                    createTask({
                        id: "task-1",
                        title: "Primeira tarefa",
                    }),
                ]}
            />
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Deletar tarefas visíveis",
            })
        )

        expect(screen.getByText("Deletar tarefas visíveis?")).toBeTruthy()
        expect(
            screen.getByText(
                "1 tarefa(s) visível(is) serão removidas permanentemente."
            )
        ).toBeTruthy()
    })

    it("deletes visible tasks after confirmation", () => {
        render(
            <TaskBulkActions
                visibleTasks={[
                    createTask({
                        id: "task-1",
                        title: "Primeira tarefa",
                    }),
                    createTask({
                        id: "task-2",
                        title: "Segunda tarefa",
                    }),
                ]}
            />
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Deletar tarefas visíveis",
            })
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Deletar visíveis",
            })
        )

        expect(mocks.deleteTask).toHaveBeenCalledTimes(2)
        expect(mocks.deleteTask).toHaveBeenCalledWith("task-1")
        expect(mocks.deleteTask).toHaveBeenCalledWith("task-2")

        expect(mocks.showToast).toHaveBeenCalledWith({
            type: "success",
            title: "Tarefas visíveis deletadas",
            description: "2 tarefa(s) visível(is) foram removidas.",
        })
    })
})