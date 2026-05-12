import { useEffect } from "react"
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
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown)
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-dialog-title"
                >
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        title="Fechar modal"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        className="ly-card relative w-full max-w-md rounded-3xl p-6 shadow-2xl shadow-black/30"
                    >
                        <div className="mb-5 flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                                <TriangleAlert size={22} />
                            </div>

                            <div>
                                <h2
                                    id="confirm-dialog-title"
                                    className="text-xl font-semibold"
                                >
                                    {title}
                                </h2>

                                <p className="ly-muted mt-2 text-sm leading-6">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button variant="secondary" onClick={onClose}>
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