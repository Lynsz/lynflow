import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { TaskNotificationCenter } from "../../src/components/notification/TaskNotificationCenter"
import type { Task } from "../../src/types/task"

const navigateMock = vi.fn()

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>(
        "react-router-dom"
    )

    return {
        ...actual,
        useNavigate: () => navigateMock,
    }
})

vi.mock("../../src/hooks/useTasks", () => {
    return {
        useTasks: () => ({
            tasks: mockedTasks,
        }),
    }
})

let mockedTasks: Task[] = []

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

function renderComponent() {
    return render(
        <MemoryRouter>
            <TaskNotificationCenter />
        </MemoryRouter>
    )
}

describe("TaskNotificationCenter", () => {
    it("renders notification trigger", () => {
        mockedTasks = []

        renderComponent()

        expect(
            screen.getByRole("button", {
                name: /abrir notificações/i,
            })
        ).toBeTruthy()
    })

    it("opens empty notification panel", () => {
        mockedTasks = []

        renderComponent()

        fireEvent.click(
            screen.getByRole("button", {
                name: /abrir notificações/i,
            })
        )

        expect(
            screen.getByRole("dialog", {
                name: "Notificações",
            })
        ).toBeTruthy()

        expect(screen.getByText("Tudo em ordem")).toBeTruthy()
    })

    it("shows task notifications", () => {
        mockedTasks = [
            createTask({
                id: "high-task",
                title: "Definir prazo crítico",
                priority: "high",
                dueDate: null,
            }),
        ]

        renderComponent()

        fireEvent.click(
            screen.getByRole("button", {
                name: /abrir notificações/i,
            })
        )

        expect(screen.getByText("Alta prioridade sem prazo")).toBeTruthy()
        expect(screen.getByText(/Definir prazo crítico/)).toBeTruthy()
    })

    it("closes panel with close button", () => {
        mockedTasks = []

        renderComponent()

        fireEvent.click(
            screen.getByRole("button", {
                name: /abrir notificações/i,
            })
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Fechar notificações",
            })
        )

        expect(screen.queryByRole("dialog")).toBeNull()
    })

    it("navigates to tasks page", () => {
        mockedTasks = []

        renderComponent()

        fireEvent.click(
            screen.getByRole("button", {
                name: /abrir notificações/i,
            })
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Ver tarefas",
            })
        )

        expect(navigateMock).toHaveBeenCalledWith("/tasks")
    })
})