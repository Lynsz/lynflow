import { useAuthContext } from "../store/AuthProvider"

export function useAuth() {
    return useAuthContext()
}
