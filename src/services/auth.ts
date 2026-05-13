type User = {
    name: string
    email: string
    password: string
}

type SessionUser = {
    name: string
    email: string
}

const USERS_KEY = "lynflow-users"
const SESSION_KEY = "lynflow-session"

function normalizeEmail(email: string) {
    return email.trim().toLowerCase()
}

function isUser(value: unknown): value is User {
    if (!value || typeof value !== "object") {
        return false
    }

    const user = value as Partial<User>

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

    return typeof user.name === "string" && typeof user.email === "string"
}

function getUsers(): User[] {
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

        return parsedUsers.filter(isUser)
    } catch {
        localStorage.removeItem(USERS_KEY)
        return []
    }
}

function saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveSession(user: SessionUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function registerUser(name: string, email: string, password: string) {
    const users = getUsers()
    const normalizedEmail = normalizeEmail(email)

    const userAlreadyExists = users.some(
        (user) => normalizeEmail(user.email) === normalizedEmail
    )

    if (userAlreadyExists) {
        throw new Error("Este e-mail já está cadastrado.")
    }

    const newUser: User = {
        name: name.trim(),
        email: normalizedEmail,
        password,
    }

    saveUsers([...users, newUser])

    saveSession({
        name: newUser.name,
        email: newUser.email,
    })
}

export function loginUser(email: string, password: string) {
    const users = getUsers()
    const normalizedEmail = normalizeEmail(email)

    const user = users.find(
        (item) =>
            normalizeEmail(item.email) === normalizedEmail &&
            item.password === password
    )

    if (!user) {
        throw new Error("E-mail ou senha inválidos.")
    }

    saveSession({
        name: user.name,
        email: user.email,
    })
}

export function updateCurrentUserProfile(name: string, email: string) {
    const session = getCurrentUser()

    if (!session) {
        throw new Error("Nenhuma sessão ativa encontrada.")
    }

    const users = getUsers()
    const normalizedEmail = normalizeEmail(email)
    const currentEmail = normalizeEmail(session.email)

    const emailAlreadyInUse = users.some(
        (user) =>
            normalizeEmail(user.email) === normalizedEmail &&
            normalizeEmail(user.email) !== currentEmail
    )

    if (emailAlreadyInUse) {
        throw new Error("Este e-mail já está sendo usado por outra conta.")
    }

    let userWasUpdated = false

    const updatedUsers = users.map((user) => {
        if (normalizeEmail(user.email) !== currentEmail) {
            return user
        }

        userWasUpdated = true

        return {
            ...user,
            name: name.trim(),
            email: normalizedEmail,
        }
    })

    if (userWasUpdated) {
        saveUsers(updatedUsers)
    }

    const updatedSession: SessionUser = {
        name: name.trim(),
        email: normalizedEmail,
    }

    saveSession(updatedSession)

    return updatedSession
}

export function logoutUser() {
    localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): SessionUser | null {
    const session = localStorage.getItem(SESSION_KEY)

    if (!session) {
        return null
    }

    try {
        const parsedSession = JSON.parse(session)

        if (!isSessionUser(parsedSession)) {
            localStorage.removeItem(SESSION_KEY)
            return null
        }

        return parsedSession
    } catch {
        localStorage.removeItem(SESSION_KEY)
        return null
    }
}

export function isAuthenticated() {
    return !!getCurrentUser()
}