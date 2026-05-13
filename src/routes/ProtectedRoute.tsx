import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Skeleton } from "../components/ui/Skeleton"

type ProtectedRouteProps = {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] p-6 text-[var(--text)]">
                <div className="mx-auto max-w-6xl space-y-4">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}
