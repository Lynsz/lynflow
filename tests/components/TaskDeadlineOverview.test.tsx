import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TaskDeadlineOverview } from "../../src/components/tasks/TaskDeadlineOverview"
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

const referenceDate = new Date("2026-05-13T12:00:00.000Z")

describe("TaskDeadlineOverview", () => {
    it("renders deadline overview title", () => {
        render(<TaskDeadlineOverview tasks={[]} referenceDate={referenceDate} />)

        expect(screen.getByText("Visão de prazos")).toBeTruthy()
        expect(
            screen.getByText(
                "Acompanhe vencimentos e tarefas que precisam de atenção."
            )
        ).toBeTruthy()
    })

    it("shows disabled overdue button when there are no overdue tasks", () => {
        render(
            <TaskDeadlineOverview
                tasks={[
                    createTask({
                        id: "pending-task",
                        title: "Tarefa pendente",
                        dueDate: "2026-05-14",
                    }),
                ]}
                referenceDate={referenceDate}
            />
        )

        const button = screen.getByRole("button", {
            name: "Filtrar tarefas atrasadas",
        }) as HTMLButtonElement

        expect(button.disabled).toBe(true)
    })

    it("calls onStatusSelect when clicking overdue button", () => {
        const onStatusSelect = vi.fn()

        render(
            <TaskDeadlineOverview
                tasks={[
                    createTask({
                        id: "overdue-task",
                        title: "Tarefa atrasada",
                        dueDate: "2026-05-12",
                    }),
                ]}
                referenceDate={referenceDate}
                onStatusSelect={onStatusSelect}
            />
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Filtrar tarefas atrasadas",
            })
        )

        expect(onStatusSelect).toHaveBeenCalledWith("overdue")
    })

    it("shows upcoming tasks ordered by due date", () => {
        render(
            <TaskDeadlineOverview
                tasks={[
                    createTask({
                        id: "task-2",
                        title: "Segunda tarefa",
                        dueDate: "2026-05-20",
                        order: 2,
                    }),
                    createTask({
                        id: "task-1",
                        title: "Primeira tarefa",
                        dueDate: "2026-05-14",
                        order: 1,
                    }),
                ]}
                referenceDate={referenceDate}
            />
        )

        const taskTitles = screen.getAllByText((content) => {
            return content === "Primeira tarefa" || content === "Segunda tarefa"
        })

        expect(taskTitles).toHaveLength(2)
        expect(taskTitles[0].textContent).toBe("Primeira tarefa")
        expect(taskTitles[1].textContent).toBe("Segunda tarefa")

        expect(screen.getByText("14/05/2026")).toBeTruthy()
        expect(screen.getByText("20/05/2026")).toBeTruthy()
    })

    it("does not show completed tasks as upcoming", () => {
        render(
            <TaskDeadlineOverview
                tasks={[
                    createTask({
                        id: "completed-task",
                        title: "Tarefa concluída",
                        done: true,
                        dueDate: "2026-05-14",
                    }),
                ]}
                referenceDate={referenceDate}
            />
        )

        expect(
            screen.getByText("Nenhuma tarefa pendente com prazo definido.")
        ).toBeTruthy()
    })
})