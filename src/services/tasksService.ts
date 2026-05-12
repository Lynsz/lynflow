import { supabase } from "../lib/supabase"

export async function getTasks() {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data
}

export async function createTask(
    title: string,
    userId: string
) {
    const { data, error } = await supabase
        .from("tasks")
        .insert({
            title,
            completed: false,
            user_id: userId,
        })
        .select()

    if (error) throw error
    return data
}

export async function toggleTask(
    id: string,
    completed: boolean
) {
    const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", id)

    if (error) throw error
}

export async function deleteTask(id: string) {
    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)

    if (error) throw error
}