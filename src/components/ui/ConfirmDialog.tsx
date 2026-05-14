import {
    useEffect,
    useId,
    useRef,
    type KeyboardEvent,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { TriangleAlert } from "lucide-react"
import { Button } from "./Button"

type ConfirmDialogProps = {
    isOpen: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "danger" | "primary"
    onConfirm: () => void
    onClose: () => void
}

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(",")

export function ConfirmDialog({
    isOpen,
    title,
    description,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    variant = "danger",
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    const titleId = useId()
    const descriptionId = useId()

    const dialogRef = useRef<HTMLDivElement | null>(null)
    const cancelButtonRef = useRef<HTMLButtonElement | null>(null)
    const previousActiveElementRef = useRef<Element | null>(null)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        previousActiveElementRef.current = document.activeElement

        const focusTimer = window.setTimeout(() => {
            cancelButtonRef.current?.focus()
        }, 50)

        return () => {
            window.clearTimeout(focusTimer)

            const previousActiveElement = previousActiveElementRef.current

            if (previousActiveElement instanceof HTMLElement) {
                previousActiveElement.focus()
            }
        }
    }, [isOpen])

    useEffect(() => {
        function handleWindowKeyDown(event: globalThis.KeyboardEvent) {
            if (event.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            window.addEventListener("keydown", handleWindowKeyDown)
        }

        return () => {
            window.removeEventListener("keydown", handleWindowKeyDown)
        }
    }, [isOpen, onClose])

    function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key !== "Tab") {
            return
        }

        const dialog = dialogRef.current

        if (!dialog) {
            return
        }

        const focusableElements = Array.from(
            dialog.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter((element) => {
            return !element.hasAttribute("disabled")
        })

        if (focusableElements.length === 0) {
            event.preventDefault()
            return
        }

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
            return
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        onClick={onClose}
                        aria-label="Fechar modal de confirmação"
                        title="Fechar modal de confirmação"
                        tabIndex={-1}
                    />

                    <motion.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        onKeyDown={handleDialogKeyDown}
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        className="ly-card ly-scrollbar relative max-h-[calc(100vh-3rem)] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-2xl shadow-black/30 outline-none"
                    >
                        <div className="mb-5 flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                                <TriangleAlert size={22} aria-hidden="true" />
                            </div>

                            <div>
                                <h2 id={titleId} className="text-xl font-semibold">
                                    {title}
                                </h2>

                                <p
                                    id={descriptionId}
                                    className="ly-muted mt-2 text-sm leading-6"
                                >
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button
                                ref={cancelButtonRef}
                                variant="secondary"
                                onClick={onClose}
                            >
                                {cancelLabel}
                            </Button>

                            <Button
                                variant={variant === "danger" ? "danger" : "primary"}
                                onClick={onConfirm}
                            >
                                {confirmLabel}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}