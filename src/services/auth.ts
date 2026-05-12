type User = {
    name: string
    email: string
    password: string
}

const USERS_KEY = "lynflow-users"
const SESSION_KEY = "lynflow-session"

function getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY)

    if (!users) {
        return []
    }

    return JSON.parse(users)
}

function saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function registerUser(name: string, email: string, password: string) {
    const users = getUsers()

    const userAlreadyExists = users.some((user) => user.email === email)

    if (userAlreadyExists) {
        throw new Error("Este e-mail já está cadastrado.")
    }

    const newUser: User = {
        name,
        email,
        password,
    }

    saveUsers([...users, newUser])

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
            name,
            email,
        })
    )
}

export function loginUser(email: string, password: string) {
    const users = getUsers()

    const user = users.find(
        (item) => item.email === email && item.password === password
    )

    if (!user) {
        throw new Error("E-mail ou senha inválidos.")
    }

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
            name: user.name,
            email: user.email,
        })
    )
}

export function logoutUser() {
    localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser() {
    const session = localStorage.getItem(SESSION_KEY)

    if (!session) {
        return null
    }

    return JSON.parse(session)
}

export function isAuthenticated() {
    return !!getCurrentUser()
}