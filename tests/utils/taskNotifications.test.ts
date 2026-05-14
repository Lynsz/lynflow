import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import { getTaskNotifications } from "../../src/utils/taskNotifications"

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

describe("taskNotifications", () => {
    it("creates overdue notification", () => {
        const notifications = getTaskNotifications(
            [
                createTask({
                    id: "overdue-task",
                    title: "Finalizar README",
                    dueDate: "2026-05-12",
                }),
            ],
            referenceDate
        )

        expect(notifications).toHaveLength(1)
        expect(notifications[0].type).toBe("overdue")
        expect(notifications[0].title).toBe("Tarefa atrasada")
    })

    it("creates due today notification", () => {
        const notifications = getTaskNotifications(
            [
                createTask({
                    id: "today-task",
                    title: "Publicar deploy",
                    dueDate: "2026-05-13",
                }),
            ],
            referenceDate
        )

        expect(notifications).toHaveLength(1)
        expect(notifications[0].type).toBe("due-today")
        expect(notifications[0].title).toBe("Vence hoje")
    })

    it("creates due soon notification", () => {
        const notifications = getTaskNotifications(
            [
                createTask({
                    id: "soon-task",
                    title: "Revisar responsividade",
                    dueDate: "2026-05-15",
                }),
            ],
            referenceDate
        )

        expect(notifications).toHaveLength(1)
        expect(notifications[0].type).toBe("due-soon")
        expect(notifications[0].title).toBe("Vencimento próximo")
    })

    it("creates high priority notification when task has no due date", () => {
        const notifications = getTaskNotifications(
            [
                createTask({
                    id: "high-task",
                    title: "Corrigir fluxo crítico",
                    priority: "high",
                    dueDate: null,
                }),
            ],
            referenceDate
        )

        expect(notifications).toHaveLength(1)
        expect(notifications[0].type).toBe("high-priority")
        expect(notifications[0].title).toBe("Alta prioridade sem prazo")
    })

    it("does not create notifications for completed tasks", () => {
        const notifications = getTaskNotifications(
            [
                createTask({
                    id: "done-task",
                    title: "Tarefa concluída",
                    done: true,
                    priority: "high",
                    dueDate: "2026-05-12",
                }),
            ],
            referenceDate
        )

        expect(notifications).toHaveLength(0)
    })

    it("sorts notifications by priority", () => {
        const notifications = getTaskNotifications(
            [
                createTask({
                    id: "high-task",
                    title: "Alta prioridade sem prazo",
                    priority: "high",
                    dueDate: null,
                }),
                createTask({
                    id: "today-task",
                    title: "Vence hoje",
                    dueDate: "2026-05-13",
                }),
                createTask({
                    id: "overdue-task",
                    title: "Atrasada",
                    dueDate: "2026-05-12",
                }),
            ],
            referenceDate
        )

        expect(notifications.map((notification) => notification.type)).toEqual([
            "overdue",
            "due-today",
            "high-priority",
        ])
    })
})