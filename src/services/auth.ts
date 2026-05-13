import { isSupabaseEnabled, supabase } from "./supabase"

export type SessionUser = {
    id?: string
    name: string
    email: string
}

type LocalUser = SessionUser & {
    password: string
}

const USERS_KEY = "lynflow-users"
const SESSION_KEY = "lynflow-session"

function normalizeEmail(email: string) {
    return email.trim().toLowerCase()
}

function normalizeName(name: string) {
    return name.trim()
}

function isLocalUser(value: unknown): value is LocalUser {
    if (!value || typeof value !== "object") {
        return false
    }

    const user = value as Partial<LocalUser>

    return (
        typeof user.name === "string" &&
        typeof user.email === "string" &&
        typeof user.password === "string"
    )
}

function isSessionUser(value: unknown): value is SessionUser {
    if (!value || typeof value !== "object") {
        return false
    }

    const user = value as Partial<SessionUser>

    return (
        typeof user.name === "string" &&
        typeof user.email === "string" &&
        (typeof user.id === "string" || typeof user.id === "undefined")
    )
}

function getUsers(): LocalUser[] {
    const users = localStorage.getItem(USERS_KEY)

    if (!users) {
        return []
    }

    try {
        const parsedUsers = JSON.parse(users)

        if (!Array.isArray(parsedUsers)) {
            localStorage.removeItem(USERS_KEY)
            return []
        }

        return parsedUsers.filter(isLocalUser)
    } catch {
        localStorage.removeItem(USERS_KEY)
        return []
    }
}

function saveUsers(users: LocalUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveSession(user: SessionUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY)
}

function getLocalCurrentUser(): SessionUser | null {
    const session = localStorage.getItem(SESSION_KEY)

    if (!session) {
        return null
    }

    try {
        const parsedSession = JSON.parse(session)

        if (!isSessionUser(parsedSession)) {
            clearSession()
            return null
        }

        return parsedSession
    } catch {
        clearSession()
        return null
    }
}

function getSupabaseDisplayName(metadataName: unknown, fallbackEmail: string) {
    if (typeof metadataName === "string" && metadataName.trim()) {
        return metadataName.trim()
    }

    return fallbackEmail.split("@")[0] || "Usuaria"
}

async function getSupabaseProfile(userId: string, email: string) {
    if (!supabase) {
        return null
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("id,name,email,created_at,updated_at")
        .eq("id", userId)
        .maybeSingle()

    if (error) {
        throw error
    }

    if (!data) {
        return null
    }

    return {
        id: data.id,
        name: data.name,
        email: data.email || email,
    }
}

export async function registerUser(
    name: string,
    email: string,
    password: string
) {
    const normalizedName = normalizeName(name)
    const normalizedEmail = normalizeEmail(email)

    if (!isSupabaseEnabled || !supabase) {
        const users = getUsers()

        const userAlreadyExists = users.some(
            (user) => normalizeEmail(user.email) === normalizedEmail
        )

        if (userAlreadyExists) {
            throw new Error("Este e-mail ja esta cadastrado.")
        }

        const newUser: LocalUser = {
            name: normalizedName,
            email: normalizedEmail,
            password,
        }

        saveUsers([...users, newUser])
        saveSession({ name: newUser.name, email: newUser.email })

        return { name: newUser.name, email: newUser.email }
    }

    const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
            data: {
                name: normalizedName,
            },
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    if (!data.user) {
        throw new Error("Nao foi possivel criar a conta no Supabase.")
    }

    const sessionUser = {
        id: data.user.id,
        name: normalizedName,
        email: data.user.email ?? normalizedEmail,
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
    })

    if (profileError) {
        throw new Error(profileError.message)
    }

    saveSession(sessionUser)

    return sessionUser
}

export async function loginUser(email: string, password: string) {
    const normalizedEmail = normalizeEmail(email)

    if (!isSupabaseEnabled || !supabase) {
        const users = getUsers()

        const user = users.find(
            (item) =>
                normalizeEmail(item.email) === normalizedEmail &&
                item.password === password
        )

        if (!user) {
            throw new Error("E-mail ou senha invalidos.")
        }

        const sessionUser = {
            name: user.name,
            email: user.email,
        }

        saveSession(sessionUser)
        return sessionUser
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
    })

    if (error) {
        throw new Error(error.message)
    }

    if (!data.user) {
        throw new Error("Nao foi possivel iniciar a sessao.")
    }

    const profile = await getSupabaseProfile(data.user.id, data.user.email ?? normalizedEmail)
    const sessionUser =
        profile ??
        {
            id: data.user.id,
            name: getSupabaseDisplayName(data.user.user_metadata.name, normalizedEmail),
            email: data.user.email ?? normalizedEmail,
        }

    saveSession(sessionUser)

    return sessionUser
}

export async function updateCurrentUserProfile(name: string, email: string) {
    const session = await getCurrentUserAsync()

    if (!session) {
        throw new Error("Nenhuma sessao ativa encontrada.")
    }

    const normalizedName = normalizeName(name)
    const normalizedEmail = normalizeEmail(email)

    if (!isSupabaseEnabled || !supabase) {
        const users = getUsers()
        const currentEmail = normalizeEmail(session.email)

        const emailAlreadyInUse = users.some(
            (user) =>
                normalizeEmail(user.email) === normalizedEmail &&
                normalizeEmail(user.email) !== currentEmail
        )

        if (emailAlreadyInUse) {
            throw new Error("Este e-mail ja esta sendo usado por outra conta.")
        }

        let userWasUpdated = false

        const updatedUsers = users.map((user) => {
            if (normalizeEmail(user.email) !== currentEmail) {
                return user
            }

            userWasUpdated = true

            return {
                ...user,
                name: normalizedName,
                email: normalizedEmail,
            }
        })

        if (userWasUpdated) {
            saveUsers(updatedUsers)
        }

        const updatedSession = {
            name: normalizedName,
            email: normalizedEmail,
        }

        saveSession(updatedSession)

        return updatedSession
    }

    if (!session.id) {
        throw new Error("Sessao remota sem usuario valido.")
    }

    const { error: authError } = await supabase.auth.updateUser({
        email: normalizedEmail,
        data: {
            name: normalizedName,
        },
    })

    if (authError) {
        throw new Error(authError.message)
    }

    const updatedSession = {
        id: session.id,
        name: normalizedName,
        email: normalizedEmail,
    }

    const { error: profileError } = await supabase
        .from("profiles")
        .upsert(updatedSession)

    if (profileError) {
        throw new Error(profileError.message)
    }

    saveSession(updatedSession)

    return updatedSession
}

export async function logoutUser() {
    if (isSupabaseEnabled && supabase) {
        const { error } = await supabase.auth.signOut()

        if (error) {
            throw new Error(error.message)
        }
    }

    clearSession()
}

export function getCurrentUser(): SessionUser | null {
    return getLocalCurrentUser()
}

export async function getCurrentUserAsync(): Promise<SessionUser | null> {
    if (!isSupabaseEnabled || !supabase) {
        return getLocalCurrentUser()
    }

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession()

    if (error) {
        throw new Error(error.message)
    }

    const authUser = session?.user

    if (!authUser) {
        clearSession()
        return null
    }

    const email = authUser.email ?? ""
    const profile = await getSupabaseProfile(authUser.id, email)
    const sessionUser =
        profile ??
        {
            id: authUser.id,
            name: getSupabaseDisplayName(authUser.user_metadata.name, email),
            email,
        }

    saveSession(sessionUser)

    return sessionUser
}

export function isAuthenticated() {
    return !!getCurrentUser()
}
