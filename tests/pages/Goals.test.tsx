import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Goals } from "../../src/pages/Goals"
import type { Task } from "../../src/types/task"

const mocks = vi.hoisted(() => ({
    productivity: 85,
    completedTasks: 8,
    pendingTasks: 2,
    highPriorityTasks: 1,
    tasks: [] as Task[],
}))

vi.mock("../../src/hooks/useTasks", () => ({
    useTasks: () => ({
        productivity: mocks.productivity,
        completedTasks: mocks.completedTasks,
        pendingTasks: mocks.pendingTasks,
        highPriorityTasks: mocks.highPriorityTasks,
        tasks: mocks.tasks,
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

function renderGoals() {
    return render(
        <MemoryRouter>
            <Goals />
        </MemoryRouter>
    )
}

describe("Goals page", () => {
    beforeEach(() => {
        mocks.productivity = 85
        mocks.completedTasks = 8
        mocks.pendingTasks = 2
        mocks.highPriorityTasks = 1
        mocks.tasks = [
            createTask({
                id: "task-1",
                title: "Tarefa concluída",
                done: true,
                priority: "high",
            }),
            createTask({
                id: "task-2",
                title: "Tarefa pendente",
                done: false,
                priority: "medium",
            }),
            createTask({
                id: "task-3",
                title: "Outra tarefa concluída",
                done: true,
                priority: "low",
            }),
        ]
    })

    it("renders goals page header and navigation action", () => {
        renderGoals()

        expect(screen.getByText("Progress system")).toBeTruthy()
        expect(screen.getByText("Goals")).toBeTruthy()
        expect(
            screen.getByText(
                "Acompanhe metas, saúde do projeto e próximos passos para transformar o Lynflow em um case forte de portfólio."
            )
        ).toBeTruthy()

        expect(
            screen.getByRole("button", {
                name: /ver tarefas/i,
            })
        ).toBeTruthy()
    })

    it("renders main project metrics", () => {
        renderGoals()

        expect(screen.getByText("Progresso do MVP")).toBeTruthy()
        expect(screen.getAllByText("85%").length).toBeGreaterThan(0)

        expect(screen.getByText("Concluídas")).toBeTruthy()
        expect(screen.getByText("Pendências")).toBeTruthy()
        expect(screen.getByText("Milestones")).toBeTruthy()

        expect(screen.getAllByText("8").length).toBeGreaterThan(0)
        expect(screen.getAllByText("2").length).toBeGreaterThan(0)
        expect(screen.getByText("4/5")).toBeTruthy()
    })

    it("renders excellent project health when productivity is high", () => {
        renderGoals()

        expect(screen.getAllByText("Excelente").length).toBeGreaterThan(0)

        expect(
            screen.getByText("O projeto está em uma fase muito avançada.")
        ).toBeTruthy()

        expect(
            screen.getByText(
                "Priorize revisão final, documentação, deploy e divulgação no portfólio."
            )
        ).toBeTruthy()
    })

    it("renders critical project health when there is not enough data", () => {
        mocks.productivity = 0
        mocks.completedTasks = 0
        mocks.pendingTasks = 0
        mocks.highPriorityTasks = 0
        mocks.tasks = []

        renderGoals()

        expect(screen.getAllByText("Sem dados suficientes").length).toBeGreaterThan(
            0
        )

        expect(
            screen.getByText(
                "Ainda não há progresso suficiente para analisar a meta."
            )
        ).toBeTruthy()

        expect(
            screen.getByText(
                "Crie tarefas, defina prioridades e acompanhe o avanço pela página Tasks."
            )
        ).toBeTruthy()
    })

    it("renders Lynflow milestones", () => {
        renderGoals()

        expect(screen.getByText("Milestones do Lynflow")).toBeTruthy()
        expect(screen.getByText("Base do produto")).toBeTruthy()
        expect(screen.getByText("Tasks avançado")).toBeTruthy()
        expect(screen.getByText("Qualidade técnica")).toBeTruthy()
        expect(screen.getByText("PWA e experiência")).toBeTruthy()
        expect(screen.getByText("Divulgação")).toBeTruthy()
    })

    it("renders weekly plan and next evolution suggestions", () => {
        renderGoals()

        expect(screen.getByText("Plano da semana")).toBeTruthy()
        expect(screen.getByText("Validar qualidade")).toBeTruthy()
        expect(screen.getByText("Atualizar documentação")).toBeTruthy()
        expect(screen.getByText("Refinar experiência")).toBeTruthy()
        expect(screen.getByText("Divulgar portfólio")).toBeTruthy()

        expect(screen.getByText("Próxima evolução sugerida")).toBeTruthy()
        expect(screen.getByText("Dashboard por período")).toBeTruthy()
        expect(screen.getByText("Calendário")).toBeTruthy()
        expect(screen.getByText("Case de portfólio")).toBeTruthy()
    })

    it("renders technical summary from task state", () => {
        renderGoals()

        expect(screen.getByText("Resumo técnico")).toBeTruthy()
        expect(screen.getByText("Total de tarefas")).toBeTruthy()
        expect(screen.getByText("Alta prioridade")).toBeTruthy()
        expect(screen.getByText("Tarefas concluídas")).toBeTruthy()
        expect(screen.getByText("Tarefas pendentes")).toBeTruthy()
        expect(screen.getByText("Saúde da meta")).toBeTruthy()
    })
})