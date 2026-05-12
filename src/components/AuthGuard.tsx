import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Login } from "../pages/auth/Login"

export function AuthGuard({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
    const [session, setSession] =
        useState<any>(null)

    useEffect(() => {
        supabase.auth
            .getSession()
            .then(({ data }) => {
                setSession(data.session)
                setLoading(false)
            })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_, session) => {
                setSession(session)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="text-white p-10">
                Loading...
            </div>
        )
    }

    if (!session) {
        return <Login />
    }

    return <>{children}</>
}