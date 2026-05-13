import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createElement } from "react"
import { describe, expect, it } from "vitest"
import App from "../src/App"

function renderAppAt(path: string) {
    window.history.pushState({}, "", path)
    return render(createElement(App))
}

function saveLocalUser() {
    localStorage.setItem(
        "lynflow-users",
        JSON.stringify([
            {
                name: "Kethelyn",
                email: "kethe@example.com",
                password: "123456",
            },
        ])
    )
}

describe("local auth flow", () => {
    it("redirects protected routes to login without a session", async () => {
        renderAppAt("/dashboard")

        expect(await screen.findByText("Bem-vinda ao Lynflow")).toBeTruthy()
        await waitFor(() => {
            expect(window.location.pathname).toBe("/login")
        })
    })

    it("registers a local user and opens the dashboard", async () => {
        const user = userEvent.setup()

        renderAppAt("/register")

        await user.type(await screen.findByLabelText("Digite seu nome"), "Kethelyn")
        await user.type(screen.getByLabelText("Digite seu e-mail"), "kethe@example.com")
        await user.type(screen.getByLabelText("Crie uma senha"), "123456")
        await user.click(screen.getByRole("button", { name: "Criar conta" }))

        await waitFor(() => {
            expect(window.location.pathname).toBe("/dashboard")
        })

        expect(localStorage.getItem("lynflow-session")).toContain("kethe@example.com")
    })

    it("logs in with a saved local account", async () => {
        const user = userEvent.setup()
        saveLocalUser()

        renderAppAt("/login")

        await user.type(await screen.findByLabelText("Digite seu e-mail"), "kethe@example.com")
        await user.type(screen.getByLabelText("Digite sua senha"), "123456")
        await user.click(screen.getByRole("button", { name: "Entrar" }))

        await waitFor(() => {
            expect(window.location.pathname).toBe("/dashboard")
        })
    })

    it("shows local persistence mode in settings", async () => {
        localStorage.setItem(
            "lynflow-session",
            JSON.stringify({
                name: "Kethelyn",
                email: "kethe@example.com",
            })
        )

        renderAppAt("/settings")

        expect(await screen.findByText("Modo de dados: Local")).toBeTruthy()
        expect(
            screen.getByText("Dados salvos no navegador via localStorage.")
        ).toBeTruthy()
    })
})
