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

    it("disables export buttons when there are no tasks", () => {
        render(<TaskExportActions visibleTasks={[]} />)

        const allButton = screen.getByRole("button", {
            name: "Exportar todas as tarefas em CSV",
        }) as HTMLButtonElement

        const filteredButton = screen.getByRole("button", {
            name: "Exportar tarefas filtradas em CSV",
        }) as HTMLButtonElement

        expect(allButton.disabled).toBe(true)
        expect(filteredButton.disabled).toBe(true)

        expect(screen.getByText("Todas (0)")).toBeTruthy()
        expect(screen.getByText("Filtradas (0)")).toBeTruthy()
    })

    it("shows task counts in export buttons", () => {
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

        render(
            <TaskExportActions
                visibleTasks={[
                    createTask({
                        id: "task-1",
                        title: "Primeira tarefa",
                    }),
                ]}
            />
        )

        expect(screen.getByText("Todas (2)")).toBeTruthy()
        expect(screen.getByText("Filtradas (1)")).toBeTruthy()
    })

    it("exports all tasks as CSV", () => {
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

        render(<TaskExportActions visibleTasks={[mocks.tasks[0]]} />)

        fireEvent.click(
            screen.getByRole("button", {
                name: "Exportar todas as tarefas em CSV",
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

    it("exports only visible filtered tasks as CSV", () => {
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

        const visibleTasks = [
            createTask({
                id: "task-2",
                title: "Segunda tarefa",
            }),
        ]

        render(<TaskExportActions visibleTasks={visibleTasks} />)

        fireEvent.click(
            screen.getByRole("button", {
                name: "Exportar tarefas filtradas em CSV",
            })
        )

        expect(mocks.createTasksCsv).toHaveBeenCalledWith(visibleTasks)
        expect(mocks.downloadCsvFile).toHaveBeenCalledWith(
            "lynflow-tasks.csv",
            "csv-content"
        )

        expect(mocks.showToast).toHaveBeenCalledWith({
            type: "success",
            title: "CSV filtrado exportado",
            description: "1 tarefa(s) foram exportadas.",
        })
    })

    it("renders export description", () => {
        render(<TaskExportActions visibleTasks={[]} />)

        expect(screen.getByText("Exportação rápida")).toBeTruthy()
        expect(
            screen.getByText(
                "Gere um arquivo CSV com todas as tarefas ou apenas com o resultado atual dos filtros."
            )
        ).toBeTruthy()
    })
})