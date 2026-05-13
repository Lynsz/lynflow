import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PwaStatus } from "../../src/components/settings/PwaStatus"
import { ToastProvider } from "../../src/components/ui/ToastProvider"

function renderPwaStatus() {
    return render(
        <ToastProvider>
            <PwaStatus />
        </ToastProvider>
    )
}

describe("PwaStatus", () => {
    it("renders PWA status cards", () => {
        renderPwaStatus()

        expect(screen.getByText("Conexão")).toBeTruthy()
        expect(screen.getByText("Service Worker")).toBeTruthy()
        expect(screen.getByText("Modo app")).toBeTruthy()
        expect(screen.getByText("Instalação")).toBeTruthy()
    })

    it("renders install section", () => {
        renderPwaStatus()

        expect(screen.getByText("Instalar Lynflow")).toBeTruthy()
        expect(
            screen.getByText(
                "Quando disponível, o navegador permite instalar o Lynflow como aplicativo no computador ou celular."
            )
        ).toBeTruthy()
    })

    it("keeps install button disabled when browser does not expose install prompt", () => {
        renderPwaStatus()

        const button = screen.getByRole("button", {
            name: "Instalação indisponível",
        })

        expect(button).toBeDisabled()
    })
})