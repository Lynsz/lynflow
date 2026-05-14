import { createRef } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Button } from "../../src/components/ui/Button"

describe("Button", () => {
    it("renders with button type by default", () => {
        render(<Button>Salvar</Button>)

        const button = screen.getByRole("button", {
            name: "Salvar",
        })

        expect(button.getAttribute("type")).toBe("button")
    })

    it("accepts custom type", () => {
        render(<Button type="submit">Enviar</Button>)

        const button = screen.getByRole("button", {
            name: "Enviar",
        })

        expect(button.getAttribute("type")).toBe("submit")
    })

    it("calls onClick when clicked", () => {
        const onClick = vi.fn()

        render(<Button onClick={onClick}>Criar tarefa</Button>)

        fireEvent.click(
            screen.getByRole("button", {
                name: "Criar tarefa",
            })
        )

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("forwards ref to native button", () => {
        const ref = createRef<HTMLButtonElement>()

        render(<Button ref={ref}>Abrir modal</Button>)

        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
        expect(ref.current?.textContent).toBe("Abrir modal")
    })

    it("does not call onClick when disabled", () => {
        const onClick = vi.fn()

        render(
            <Button disabled onClick={onClick}>
                Salvar
            </Button>
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Salvar",
            })
        )

        expect(onClick).not.toHaveBeenCalled()
    })
})