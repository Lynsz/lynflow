import { describe, expect, it } from "vitest"
import {
    mapSupabaseActivity,
    mapSupabaseTask,
    type SupabaseTask,
    type SupabaseTaskActivity,
} from "../../src/types/supabase"

describe("Supabase mappers", () => {
    it("maps Supabase tasks to the front-end task shape", () => {
        const task: SupabaseTask = {
            id: "task-1",
            user_id: "user-1",
            title: "Sincronizar tarefas",
            category: "Projeto",
            priority: "high",
            done: false,
            due_date: "2026-05-20",
            order_index: 4,
            created_at: "2026-05-13T10:00:00.000Z",
            updated_at: "2026-05-13T10:00:00.000Z",
        }

        expect(mapSupabaseTask(task)).toEqual({
            id: "task-1",
            title: "Sincronizar tarefas",
            category: "Projeto",
            priority: "high",
            done: false,
            dueDate: "2026-05-20",
            order: 4,
            createdAt: "2026-05-13T10:00:00.000Z",
        })
    })

    it("maps Supabase activities to the front-end activity shape", () => {
        const activity: SupabaseTaskActivity = {
            id: "activity-1",
            user_id: "user-1",
            type: "created",
            title: "Tarefa criada",
            description: "Uma tarefa foi criada.",
            created_at: "2026-05-13T10:00:00.000Z",
        }

        expect(mapSupabaseActivity(activity)).toEqual({
            id: "activity-1",
            type: "created",
            title: "Tarefa criada",
            description: "Uma tarefa foi criada.",
            createdAt: "2026-05-13T10:00:00.000Z",
        })
    })
})
