import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import {
    buildRemoteActivityPayload,
    buildRemoteTaskPayload,
    buildRemoteTaskUpdatePayload,
} from "../../src/utils/remoteTaskPayload"

const baseTask: Task = {
    id: "local-task-1",
    title: "Tarefa remota",
    category: "Projeto",
    priority: "high",
    done: false,
    dueDate: "2026-05-20",
    recurrence: "weekly",
    createdAt: "2026-05-14T12:00:00.000Z",
    order: 2,
}

describe("remoteTaskPayload", () => {
    it("preserves user_id when building remote task inserts", () => {
        expect(buildRemoteTaskPayload("user-1", baseTask)).toEqual({
            user_id: "user-1",
            title: "Tarefa remota",
            category: "Projeto",
            priority: "high",
            done: false,
            due_date: "2026-05-20",
            recurrence: "weekly",
            order_index: 2,
        })
    })

    it("does not include user_id in update payloads", () => {
        expect(
            buildRemoteTaskUpdatePayload({
                title: "Novo titulo",
                done: true,
                recurrence: "monthly",
            })
        ).toEqual({
            title: "Novo titulo",
            done: true,
            recurrence: "monthly",
        })
    })

    it("preserves user_id when building remote activity inserts", () => {
        expect(
            buildRemoteActivityPayload(
                "user-1",
                "created",
                "Tarefa criada",
                "Uma tarefa foi criada."
            )
        ).toEqual({
            user_id: "user-1",
            type: "created",
            title: "Tarefa criada",
            description: "Uma tarefa foi criada.",
        })
    })
})
