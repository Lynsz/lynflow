import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TaskKanbanBoard } from "../../src/components/tasks/TaskKanbanBoard"
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

const handlers = {
    onEditingTitleChange: vi.fn(),
    onStartEdit: vi.fn(),
    onSaveEdit: vi.fn(),
    onCancelEdit: vi.fn(),
    onToggle: vi.fn(),
    onDelete: vi.fn(),
}

function renderKanban(tasks: Task[]) {
    return render(
        <TaskKanbanBoard
            tasks={tasks}
            editingId={null}
            editingTitle=""
            {...handlers}
        />
    )
}

describe("TaskKanbanBoard", () => {
    it("renders empty state when there are no tasks", () => {
        renderKanban([])

        expect(screen.getByText("Nenhuma tarefa para exibir")).toBeTruthy()
        expect(
            screen.getByText(
                "Crie uma tarefa ou ajuste os filtros para visualizar o Kanban."
            )
        ).toBeTruthy()
    })

    it("groups tasks by overdue, pending and completed columns", () => {
        renderKanban([
            createTask({
                id: "overdue-task",
                title: "Tarefa atrasada",
                done: false,
                dueDate: "2000-01-01",
            }),
            createTask({
                id: "pending-task",
                title: "Tarefa pendente",
                done: false,
                dueDate: "2099-01-01",
            }),
            createTask({
                id: "completed-task",
                title: "Tarefa concluída",
                done: true,
                dueDate: "2000-01-01",
            }),
        ])

        expect(screen.getByText("Atrasadas")).toBeTruthy()
        expect(screen.getByText("Pendentes")).toBeTruthy()
        expect(screen.getByText("Concluídas")).toBeTruthy()

        expect(screen.getByText("Tarefa atrasada")).toBeTruthy()
        expect(screen.getByText("Tarefa pendente")).toBeTruthy()
        expect(screen.getByText("Tarefa concluída")).toBeTruthy()
    })

    it("shows empty column message when a column has no tasks", () => {
        renderKanban([
            createTask({
                id: "only-pending-task",
                title: "Tarefa única",
                done: false,
                dueDate: "2099-01-01",
            }),
        ])

        expect(screen.getByText("Tarefa única")).toBeTruthy()

        const emptyMessages = screen.getAllByText("Nenhuma tarefa nesta coluna.")

        expect(emptyMessages.length).toBe(2)
    })
})