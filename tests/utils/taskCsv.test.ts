import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import { createTasksCsv, getTasksCsvFileName } from "../../src/utils/taskCsv"

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

describe("taskCsv", () => {
    it("creates CSV with headers", () => {
        const csv = createTasksCsv([], referenceDate)

        expect(csv).toBe(
            '"Título";"Categoria";"Prioridade";"Status";"Vencimento";"Criada em"'
        )
    })

    it("creates CSV rows from tasks", () => {
        const csv = createTasksCsv(
            [
                createTask({
                    title: "Criar README",
                    category: "Portfolio",
                    priority: "high",
                    done: false,
                    dueDate: "2026-05-14",
                    createdAt: "2026-05-13T10:00:00.000Z",
                }),
            ],
            referenceDate
        )

        expect(csv).toContain('"Criar README"')
        expect(csv).toContain('"Portfolio"')
        expect(csv).toContain('"Alta"')
        expect(csv).toContain('"Pendente"')
        expect(csv).toContain('"14/05/2026"')
        expect(csv).toContain('"13/05/2026"')
    })

    it("marks overdue tasks", () => {
        const csv = createTasksCsv(
            [
                createTask({
                    title: "Tarefa vencida",
                    done: false,
                    dueDate: "2026-05-12",
                }),
            ],
            referenceDate
        )

        expect(csv).toContain('"Atrasada"')
    })

    it("marks completed tasks", () => {
        const csv = createTasksCsv(
            [
                createTask({
                    title: "Tarefa concluída",
                    done: true,
                    dueDate: "2026-05-12",
                }),
            ],
            referenceDate
        )

        expect(csv).toContain('"Concluída"')
    })

    it("escapes quotes inside values", () => {
        const csv = createTasksCsv(
            [
                createTask({
                    title: 'Revisar "Dashboard"',
                }),
            ],
            referenceDate
        )

        expect(csv).toContain('"Revisar ""Dashboard"""')
    })

    it("creates CSV file name", () => {
        const fileName = getTasksCsvFileName(new Date(2026, 4, 13))

        expect(fileName).toBe("lynflow-tasks-2026-05-13.csv")
    })
})