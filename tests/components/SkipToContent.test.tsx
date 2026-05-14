import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SkipToContent } from "../../src/components/accessibility/SkipToContent"

describe("SkipToContent", () => {
    it("renders a skip link to main content", () => {
        render(<SkipToContent />)

        const link = screen.getByRole("link", {
            name: "Pular para o conteúdo principal",
        })

        expect(link).toBeTruthy()
        expect(link.getAttribute("href")).toBe("#main-content")
    })

    it("is visually hidden until focused", () => {
        render(<SkipToContent />)

        const link = screen.getByRole("link", {
            name: "Pular para o conteúdo principal",
        })

        expect(link.className).toContain("sr-only")
        expect(link.className).toContain("focus:not-sr-only")
    })
})