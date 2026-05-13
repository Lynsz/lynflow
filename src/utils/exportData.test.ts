import { describe, expect, it } from "vitest"
import {
    createLynflowExportPayload,
    getLynflowExportFileName,
    parseLynflowBackupFileContent,
    parseLynflowExportPayload,
} from "../../src/utils/exportData"
import type { TaskActivity } from "../../src/types/activity"
import type { Task } from "../../src/types/task"

const tasks: Task[] = [
    {
        id: "task-1",
        title: "Finalizar Lynflow",
        category: "Projeto",
        priority: "high",
        done: false,
        dueDate: "2026-05-20",
        createdAt: "2026-05-13T12:00:00.000Z",
        order: 0,
    },
    {
        id: "task-2",
        title: "Criar README",
        category: "Portfolio",
        priority: "medium",
        done: true,
        dueDate: null,
        createdAt: "2026-05-13T13:00:00.000Z",
        order: 1,
    },
]

const activities: TaskActivity[] = [
    {
        id: "activity-1",
        type: "created",
        title: "Tarefa criada",
        description: "Finalizar Lynflow foi adicionada.",
        createdAt: "2026-05-13T12:00:00.000Z",
    },
    {
        id: "activity-2",
        type: "completed",
        title: "Tarefa concluida",
        description: "Criar README foi marcada como concluida.",
        createdAt: "2026-05-13T13:00:00.000Z",
    },
]

describe("exportData", () => {
    describe("getLynflowExportFileName", () => {
        it("creates a deterministic backup file name", () => {
            const date = new Date(2026, 4, 13, 16, 7)

            expect(getLynflowExportFileName(date)).toBe(
                "lynflow-backup-2026-05-13-1607.json"
            )
        })
    })

    describe("createLynflowExportPayload", () => {
        it("creates a complete export payload with summary", () => {
            const payload = createLynflowExportPayload({
                dataMode: "local",
                user: {
                    name: "Lyn",
                    email: "lyn@example.com",
                },
                tasks,
                activities,
                exportedAt: "2026-05-13T16:00:00.000Z",
            })

            expect(payload).toEqual({
                app: "Lynflow",
                version: 1,
                exportedAt: "2026-05-13T16:00:00.000Z",
                dataMode: "local",
                user: {
                    name: "Lyn",
                    email: "lyn@example.com",
                },
                summary: {
                    totalTasks: 2,
                    completedTasks: 1,
                    pendingTasks: 1,
                    totalActivities: 2,
                },
                tasks,
                activities,
            })
        })

        it("allows export without authenticated user", () => {
            const payload = createLynflowExportPayload({
                dataMode: "supabase",
                user: null,
                tasks,
                activities,
                exportedAt: "2026-05-13T16:00:00.000Z",
            })

            expect(payload.user).toBeNull()
            expect(payload.dataMode).toBe("supabase")
        })
    })

    describe("parseLynflowExportPayload", () => {
        it("parses a valid backup payload", () => {
            const payload = createLynflowExportPayload({
                dataMode: "local",
                user: {
                    name: "Lyn",
                    email: "lyn@example.com",
                },
                tasks,
                activities,
                exportedAt: "2026-05-13T16:00:00.000Z",
            })

            const parsedPayload = parseLynflowExportPayload(payload)

            expect(parsedPayload.app).toBe("Lynflow")
            expect(parsedPayload.version).toBe(1)
            expect(parsedPayload.tasks).toHaveLength(2)
            expect(parsedPayload.activities).toHaveLength(2)
            expect(parsedPayload.summary.completedTasks).toBe(1)
        })

        it("rejects invalid backup objects", () => {
            expect(() => parseLynflowExportPayload(null)).toThrow(
                "Arquivo de backup invalido."
            )

            expect(() =>
                parseLynflowExportPayload({
                    app: "OtherApp",
                    version: 1,
                    dataMode: "local",
                    tasks: [],
                    activities: [],
                })
            ).toThrow("Este arquivo nao parece ser um backup valido do Lynflow.")
        })

        it("rejects invalid task data", () => {
            expect(() =>
                parseLynflowExportPayload({
                    app: "Lynflow",
                    version: 1,
                    dataMode: "local",
                    tasks: [
                        {
                            id: "task-1",
                            title: "Invalid task",
                        },
                    ],
                    activities: [],
                })
            ).toThrow("O backup contem tarefas invalidas.")
        })

        it("rejects invalid activity data", () => {
            expect(() =>
                parseLynflowExportPayload({
                    app: "Lynflow",
                    version: 1,
                    dataMode: "local",
                    tasks: [],
                    activities: [
                        {
                            id: "activity-1",
                            type: "invalid",
                            title: "Invalid activity",
                            description: "Invalid activity",
                            createdAt: "2026-05-13T12:00:00.000Z",
                        },
                    ],
                })
            ).toThrow("O backup contem atividades invalidas.")
        })
    })

    describe("parseLynflowBackupFileContent", () => {
        it("parses a valid JSON backup file content", () => {
            const payload = createLynflowExportPayload({
                dataMode: "local",
                user: {
                    name: "Lyn",
                    email: "lyn@example.com",
                },
                tasks,
                activities,
                exportedAt: "2026-05-13T16:00:00.000Z",
            })

            const parsedPayload = parseLynflowBackupFileContent(
                JSON.stringify(payload)
            )

            expect(parsedPayload.tasks).toHaveLength(2)
            expect(parsedPayload.activities).toHaveLength(2)
        })

        it("rejects invalid JSON content", () => {
            expect(() => parseLynflowBackupFileContent("{invalid-json")).toThrow()
        })
    })
})