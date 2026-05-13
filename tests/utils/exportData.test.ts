import { describe, expect, it } from "vitest"
import type { TaskActivity } from "../../src/types/activity"
import type { Task } from "../../src/types/task"
import {
    createLynflowExportPayload,
    getLynflowExportFileName,
} from "../../src/utils/exportData"

const tasks: Task[] = [
    {
        id: "1",
        title: "Exportar dados",
        category: "Projeto",
        priority: "high",
        done: true,
        createdAt: "2026-05-13T10:00:00.000Z",
        order: 0,
    },
    {
        id: "2",
        title: "Revisar backup",
        category: "Projeto",
        priority: "medium",
        done: false,
        createdAt: "2026-05-13T11:00:00.000Z",
        order: 1,
    },
]

const activities: TaskActivity[] = [
    {
        id: "activity-1",
        type: "created",
        title: "Tarefa criada",
        description: "Exportar dados foi adicionada.",
        createdAt: "2026-05-13T10:00:00.000Z",
    },
]

describe("exportData", () => {
    it("creates a structured Lynflow export payload", () => {
        const payload = createLynflowExportPayload({
            dataMode: "local",
            user: {
                name: "Kethelyn",
                email: "kethe@example.com",
            },
            tasks,
            activities,
            exportedAt: "2026-05-13T12:00:00.000Z",
        })

        expect(payload).toEqual({
            app: "Lynflow",
            version: 1,
            exportedAt: "2026-05-13T12:00:00.000Z",
            dataMode: "local",
            user: {
                name: "Kethelyn",
                email: "kethe@example.com",
            },
            summary: {
                totalTasks: 2,
                completedTasks: 1,
                pendingTasks: 1,
                totalActivities: 1,
            },
            tasks,
            activities,
        })
    })

    it("generates stable backup file names", () => {
        const fileName = getLynflowExportFileName(
            new Date("2026-05-13T09:07:00")
        )

        expect(fileName).toBe("lynflow-backup-2026-05-13-0907.json")
    })
})
