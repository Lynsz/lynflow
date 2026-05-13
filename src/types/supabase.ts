import type { ActivityType } from "./activity"
import type { TaskActivity } from "./activity"
import type { Priority, Task } from "./task"

export type SupabaseProfile = {
    id: string
    name: string
    email: string
    created_at: string
    updated_at: string
}

export type SupabaseTask = {
    id: string
    user_id: string
    title: string
    category: string
    priority: Priority
    done: boolean
    order_index: number
    created_at: string
    updated_at: string
}

export type SupabaseTaskActivity = {
    id: string
    user_id: string
    type: ActivityType
    title: string
    description: string
    created_at: string
}

export type SupabaseDatabase = {
    public: {
        Tables: {
            profiles: {
                Row: SupabaseProfile
                Insert: Omit<SupabaseProfile, "created_at" | "updated_at">
                Update: Partial<Omit<SupabaseProfile, "id" | "created_at" | "updated_at">>
                Relationships: []
            }
            tasks: {
                Row: SupabaseTask
                Insert: Omit<SupabaseTask, "id" | "created_at" | "updated_at">
                Update: Partial<Omit<SupabaseTask, "id" | "user_id" | "created_at" | "updated_at">>
                Relationships: []
            }
            task_activities: {
                Row: SupabaseTaskActivity
                Insert: Omit<SupabaseTaskActivity, "id" | "created_at">
                Update: never
                Relationships: []
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
        CompositeTypes: Record<string, never>
    }
}

export function mapSupabaseTask(task: SupabaseTask): Task {
    return {
        id: task.id,
        title: task.title,
        category: task.category,
        priority: task.priority,
        done: task.done,
        createdAt: task.created_at,
        order: task.order_index,
    }
}

export function mapSupabaseActivity(
    activity: SupabaseTaskActivity
): TaskActivity {
    return {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        createdAt: activity.created_at,
    }
}
