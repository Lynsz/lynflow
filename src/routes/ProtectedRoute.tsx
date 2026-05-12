import { Navigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"

export function ProtectedRoute({ children }: any) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
            setLoading(false)
        })
    }, [])

    if (loading) return <p>Loading...</p>

    if (!user) return <Navigate to="/login" replace />

    return children
}