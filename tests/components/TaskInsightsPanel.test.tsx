import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TaskInsightsPanel } from "../../src/components/tasks/TaskInsightsPanel"
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

describe("TaskInsightsPanel", () => {
    it("renders empty state when there are no visible tasks", () => {
        render(
            <TaskInsightsPanel
                visibleTasks={[]}
                totalTasks={3}
                referenceDate={referenceDate}
            />
        )

        expect(screen.getByText("Insights do filtro atual")).toBeTruthy()
        expect(screen.getByText("Nenhuma tarefa visível para analisar.")).toBeTruthy()
        expect(
            screen.getByText("0 de 3 tarefa(s) visível(is) após filtros.")
        ).toBeTruthy()
    })

    it("renders insights from visible tasks", () => {
        render(
            <TaskInsightsPanel
                visibleTasks={[
                    createTask({
                        id: "task-1",
                        title: "Concluída",
                        category: "Portfolio",
                        priority: "high",
                        done: true,
                    }),
                    createTask({
                        id: "task-2",
                        title: "Atrasada",
                        category: "Portfolio",
                        priority: "high",
                        done: false,
                        dueDate: "2026-05-12",
                    }),
                    createTask({
                        id: "task-3",
                        title: "Pendente",
                        category: "Estudos",
                        priority: "medium",
                        done: false,
                        dueDate: "2026-05-14",
                    }),
                ]}
                totalTasks={3}
                referenceDate={referenceDate}
            />
        )

        expect(screen.getByText("33%")).toBeTruthy()
        expect(screen.getByText("Concluídas")).toBeTruthy()
        expect(screen.getByText("Atrasadas")).toBeTruthy()
        expect(screen.getByText("Alta prioridade")).toBeTruthy()
        expect(screen.getByText("Categoria principal")).toBeTruthy()
        expect(screen.getByText("Portfolio")).toBeTruthy()
        expect(screen.getByText("1 pendente(s) no filtro atual.")).toBeTruthy()
        expect(screen.getByText("2 tarefa(s) nessa categoria.")).toBeTruthy()
    })

    it("shows filtered amount when visible tasks are different from total tasks", () => {
        render(
            <TaskInsightsPanel
                visibleTasks={[
                    createTask({
                        id: "task-1",
                        title: "Tarefa filtrada",
                    }),
                ]}
                totalTasks={5}
                referenceDate={referenceDate}
            />
        )

        expect(
            screen.getByText("1 de 5 tarefa(s) visível(is) após filtros.")
        ).toBeTruthy()
    })
})