import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TaskSummaryCards } from "../../src/components/tasks/TaskSummaryCards"
import type { Task } from "../../src/types/task"

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

describe("TaskSummaryCards", () => {
    it("renders all summary card titles", () => {
        render(<TaskSummaryCards tasks={[]} />)

        expect(screen.getByText("Total")).toBeTruthy()
        expect(screen.getByText("Pendentes")).toBeTruthy()
        expect(screen.getByText("Atrasadas")).toBeTruthy()
        expect(screen.getByText("Concluídas")).toBeTruthy()
    })

    it("renders zero state correctly", () => {
        render(<TaskSummaryCards tasks={[]} />)

        expect(screen.getByText("0% de conclusão geral")).toBeTruthy()
        expect(screen.getByText("Tarefas abertas dentro do prazo")).toBeTruthy()
        expect(screen.getByText("Tarefas pendentes fora do prazo")).toBeTruthy()
        expect(screen.getByText("Tarefas finalizadas")).toBeTruthy()

        expect(screen.getAllByText("0")).toHaveLength(4)
    })

    it("calculates total, pending, overdue, completed and completion rate", () => {
        render(
            <TaskSummaryCards
                tasks={[
                    createTask({
                        id: "pending-task",
                        title: "Tarefa pendente",
                        done: false,
                        dueDate: "2099-01-01",
                    }),
                    createTask({
                        id: "overdue-task",
                        title: "Tarefa atrasada",
                        done: false,
                        dueDate: "2000-01-01",
                    }),
                    createTask({
                        id: "completed-task",
                        title: "Tarefa concluída",
                        done: true,
                        dueDate: "2000-01-01",
                    }),
                    createTask({
                        id: "completed-task-2",
                        title: "Tarefa concluída 2",
                        done: true,
                        dueDate: null,
                    }),
                ]}
            />
        )

        expect(screen.getByText("50% de conclusão geral")).toBeTruthy()
        expect(screen.getByText("4")).toBeTruthy()
        expect(screen.getAllByText("1")).toHaveLength(2)
        expect(screen.getByText("2")).toBeTruthy()
    })
})