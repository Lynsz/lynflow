import { supabase } from "./supabase"
import type { Priority } from "../types/task"

type LegacyTask = {
    id: string
    title: string
    completed: boolean
}

function requireSupabase() {
    if (!supabase) {
        throw new Error("Supabase nao esta configurado.")
    }

    return supabase
}

export async function getTasks(): Promise<LegacyTask[]> {
    const client = requireSupabase()

    const { data, error } = await client
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error

    return data.map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.done,
    }))
}

export async function createTask(title: string, userId: string) {
    const client = requireSupabase()

    const { data, error } = await client
        .from("tasks")
        .insert({
            title,
            category: "Geral",
            priority: "medium" satisfies Priority,
            done: false,
            due_date: null,
            order_index: 0,
            user_id: userId,
        })
        .select()

    if (error) throw error
    return data
}

export async function toggleTask(id: string, completed: boolean) {
    const client = requireSupabase()

    const { error } = await client
        .from("tasks")
        .update({ done: completed })
        .eq("id", id)

    if (error) throw error
}

export async function deleteTask(id: string) {
    const client = requireSupabase()

    const { error } = await client
        .from("tasks")
        .delete()
        .eq("id", id)

    if (error) throw error
}
