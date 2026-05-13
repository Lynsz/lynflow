/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"
import {
    getCurrentUserAsync,
    loginUser,
    logoutUser,
    registerUser,
    updateCurrentUserProfile,
    type SessionUser,
} from "../services/auth"
import { isSupabaseEnabled, supabase } from "../services/supabase"

type AuthContextValue = {
    user: SessionUser | null
    isLoading: boolean
    isAuthenticated: boolean
    dataMode: "local" | "supabase"
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<SessionUser | null>
    login: (email: string, password: string) => Promise<SessionUser>
    logout: () => Promise<void>
    updateProfile: (name: string, email: string) => Promise<SessionUser>
    refreshUser: () => Promise<void>
}

type AuthProviderProps = {
    children: ReactNode
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function sessionToUser(session: Session | null) {
    if (!session) {
        return null
    }

    return getCurrentUserAsync()
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<SessionUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    async function refreshUser() {
        const currentUser = await getCurrentUserAsync()
        setUser(currentUser)
    }

    useEffect(() => {
        let isMounted = true

        getCurrentUserAsync()
            .then((currentUser) => {
                if (isMounted) {
                    setUser(currentUser)
                }
            })
            .catch(() => {
                if (isMounted) {
                    setUser(null)
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false)
                }
            })

        if (!isSupabaseEnabled || !supabase) {
            return () => {
                isMounted = false
            }
        }

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                sessionToUser(session)
                    .then((currentUser) => {
                        if (isMounted) {
                            setUser(currentUser)
                        }
                    })
                    .catch(() => {
                        if (isMounted) {
                            setUser(null)
                        }
                    })
            }
        )

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isLoading,
            isAuthenticated: Boolean(user),
            dataMode: isSupabaseEnabled ? "supabase" : "local",
            async register(name, email, password) {
                const registeredUser = await registerUser(name, email, password)
                setUser(registeredUser)
                return registeredUser
            },
            async login(email, password) {
                const loggedUser = await loginUser(email, password)
                setUser(loggedUser)
                return loggedUser
            },
            async logout() {
                await logoutUser()
                setUser(null)
            },
            async updateProfile(name, email) {
                const updatedUser = await updateCurrentUserProfile(name, email)
                setUser(updatedUser)
                return updatedUser
            },
            refreshUser,
        }),
        [isLoading, user]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider.")
    }

    return context
}