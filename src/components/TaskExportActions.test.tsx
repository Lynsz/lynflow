import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { TaskExportActions } from "../../src/components/tasks/TaskExportActions"
import type { Task } from "../../src/types/task"

const mocks = vi.hoisted(() => ({
    tasks: [] as Task[],
    showToast: vi.fn(),
    createTasksCsv: vi.fn(),
    downloadCsvFile: vi.fn(),
    getTasksCsvFileName: vi.fn(),
}))

vi.mock("../../src/hooks/useTasks", () => ({
    useTasks: () => ({
        tasks: mocks.tasks,
    }),
}))

vi.mock("../../src/components/ui/ToastProvider", () => ({
    useToast: () => ({
        showToast: mocks.showToast,
    }),
}))

vi.mock("../../src/utils/taskCsv", () => ({
    createTasksCsv: mocks.createTasksCsv,
    downloadCsvFile: mocks.downloadCsvFile,
    getTasksCsvFileName: mocks.getTasksCsvFileName,
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

describe("TaskExportActions", () => {
    beforeEach(() => {
        mocks.tasks = []
        mocks.showToast.mockClear()
        mocks.createTasksCsv.mockClear()
        mocks.downloadCsvFile.mockClear()
        mocks.getTasksCsvFileName.mockClear()

        mocks.createTasksCsv.mockReturnValue("csv-content")
        mocks.getTasksCsvFileName.mockReturnValue("lynflow-tasks.csv")
    })

    it("disables export button when there are no tasks", () => {
        render(<TaskExportActions />)

        const button = screen.getByRole("button", {
            name: "Exportar tarefas em CSV",
        }) as HTMLButtonElement

        expect(button.disabled).toBe(true)
        expect(screen.getByText("Exportar CSV (0)")).toBeTruthy()
    })

    it("shows task count in export button", () => {
        mocks.tasks = [
            createTask({
                id: "task-1",
                title: "Primeira tarefa",
            }),
            createTask({
                id: "task-2",
                title: "Segunda tarefa",
            }),
        ]

        render(<TaskExportActions />)

        expect(screen.getByText("Exportar CSV (2)")).toBeTruthy()
    })

    it("exports tasks as CSV when clicking the button", () => {
        mocks.tasks = [
            createTask({
                id: "task-1",
                title: "Primeira tarefa",
            }),
            createTask({
                id: "task-2",
                title: "Segunda tarefa",
                done: true,
            }),
        ]

        render(<TaskExportActions />)

        fireEvent.click(
            screen.getByRole("button", {
                name: "Exportar tarefas em CSV",
            })
        )

        expect(mocks.createTasksCsv).toHaveBeenCalledWith(mocks.tasks)
        expect(mocks.getTasksCsvFileName).toHaveBeenCalledTimes(1)
        expect(mocks.downloadCsvFile).toHaveBeenCalledWith(
            "lynflow-tasks.csv",
            "csv-content"
        )

        expect(mocks.showToast).toHaveBeenCalledWith({
            type: "success",
            title: "CSV exportado",
            description: "2 tarefa(s) foram exportadas.",
        })
    })

    it("renders export description", () => {
        render(<TaskExportActions />)

        expect(screen.getByText("Exportação rápida")).toBeTruthy()
        expect(
            screen.getByText(
                "Gere um arquivo CSV com título, categoria, prioridade, status, vencimento e data de criação."
            )
        ).toBeTruthy()
    })
})