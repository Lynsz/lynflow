import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ConfirmDialog } from "../../src/components/ui/ConfirmDialog"

describe("ConfirmDialog", () => {
    it("renders dialog with accessible title and description", () => {
        render(
            <ConfirmDialog
                isOpen
                title="Excluir tarefa"
                description="Essa ação não poderá ser desfeita."
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                onConfirm={vi.fn()}
                onClose={vi.fn()}
            />
        )

        const dialog = screen.getByRole("dialog", {
            name: "Excluir tarefa",
        })

        expect(dialog).toBeTruthy()
        expect(dialog.getAttribute("aria-modal")).toBe("true")
        expect(dialog.getAttribute("aria-describedby")).toBeTruthy()
        expect(screen.getByText("Essa ação não poderá ser desfeita.")).toBeTruthy()
    })

    it("calls onClose when Escape is pressed", () => {
        const onClose = vi.fn()

        render(
            <ConfirmDialog
                isOpen
                title="Excluir tarefa"
                description="Essa ação não poderá ser desfeita."
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                onConfirm={vi.fn()}
                onClose={onClose}
            />
        )

        fireEvent.keyDown(window, {
            key: "Escape",
        })

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("calls onConfirm when confirm button is clicked", () => {
        const onConfirm = vi.fn()

        render(
            <ConfirmDialog
                isOpen
                title="Excluir tarefa"
                description="Essa ação não poderá ser desfeita."
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                onConfirm={onConfirm}
                onClose={vi.fn()}
            />
        )

        fireEvent.click(
            screen.getByRole("button", {
                name: "Excluir",
            })
        )

        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it("does not render when closed", () => {
        render(
            <ConfirmDialog
                isOpen={false}
                title="Excluir tarefa"
                description="Essa ação não poderá ser desfeita."
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                onConfirm={vi.fn()}
                onClose={vi.fn()}
            />
        )

        expect(screen.queryByRole("dialog")).toBeNull()
    })
})