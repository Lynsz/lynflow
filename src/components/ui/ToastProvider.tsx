import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info"

type Toast = {
    id: string
    type: ToastType
    title: string
    description?: string
}

type ShowToastData = {
    type?: ToastType
    title: string
    description?: string
}

type ToastContextValue = {
    showToast: (data: ShowToastData) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

type ToastProviderProps = {
    children: ReactNode
}

function createId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID()
    }

    return String(Date.now() + Math.random())
}

function getToastIcon(type: ToastType) {
    if (type === "success") {
        return <CheckCircle2 size={18} className="text-emerald-500" />
    }

    if (type === "error") {
        return <XCircle size={18} className="text-red-500" />
    }

    if (type === "warning") {
        return <TriangleAlert size={18} className="text-yellow-500" />
    }

    return <Info size={18} className="text-blue-500" />
}

function getToastClass(type: ToastType) {
    if (type === "success") {
        return "border-emerald-500/20 bg-emerald-500/10"
    }

    if (type === "error") {
        return "border-red-500/20 bg-red-500/10"
    }

    if (type === "warning") {
        return "border-yellow-500/20 bg-yellow-500/10"
    }

    return "border-blue-500/20 bg-blue-500/10"
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([])

    function removeToast(id: string) {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id)
        )
    }

    function showToast({
        type = "info",
        title,
        description,
    }: ShowToastData) {
        const id = createId()

        const newToast: Toast = {
            id,
            type,
            title,
            description,
        }

        setToasts((currentToasts) => [newToast, ...currentToasts])

        window.setTimeout(() => {
            removeToast(id)
        }, 3500)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 24, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 24, scale: 0.96 }}
                            className={`rounded-2xl border p-4 shadow-2xl shadow-black/20 backdrop-blur-xl ${getToastClass(
                                toast.type
                            )}`}
                        >
                            <div className="flex gap-3">
                                <div className="mt-0.5">{getToastIcon(toast.type)}</div>

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-[var(--text)]">
                                        {toast.title}
                                    </p>

                                    {toast.description && (
                                        <p className="mt-1 text-sm text-[var(--muted)]">
                                            {toast.description}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeToast(toast.id)}
                                    aria-label="Fechar notificação"
                                    title="Fechar notificação"
                                    className="rounded-lg p-1 text-[var(--muted-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToast deve ser usado dentro de ToastProvider.")
    }

    return context
}