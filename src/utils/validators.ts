export function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateLoginForm(email: string, password: string) {
    if (!email.trim() || !password.trim()) {
        return "Preencha e-mail e senha."
    }

    if (!isValidEmail(email)) {
        return "Digite um e-mail válido."
    }

    return null
}

export function validateRegisterForm(
    name: string,
    email: string,
    password: string
) {
    if (!name.trim() || !email.trim() || !password.trim()) {
        return "Preencha todos os campos."
    }

    if (name.trim().length < 2) {
        return "Digite um nome com pelo menos 2 caracteres."
    }

    if (!isValidEmail(email)) {
        return "Digite um e-mail válido."
    }

    if (password.length < 6) {
        return "A senha precisa ter pelo menos 6 caracteres."
    }

    return null
}

export function validateProfileForm(name: string, email: string) {
    if (!name.trim() || !email.trim()) {
        return "Preencha nome e e-mail."
    }

    if (name.trim().length < 2) {
        return "Digite um nome com pelo menos 2 caracteres."
    }

    if (!isValidEmail(email)) {
        return "Digite um e-mail válido."
    }

    return null
}