import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "./ui/ToastProvider"

function isEditableElement(target: EventTarget | null) {
    const element = target as HTMLElement | null

    if (!element) return false

    const tagName = element.tagName.toLowerCase()

    return (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        element.isContentEditable
    )
}

export function GlobalShortcuts() {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const sequenceRef = useRef("")
    const timerRef = useRef<number | null>(null)

    function resetSequence() {
        sequenceRef.current = ""

        if (timerRef.current) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }

    function startSequence(key: string) {
        sequenceRef.current = key

        if (timerRef.current) {
            window.clearTimeout(timerRef.current)
        }

        timerRef.current = window.setTimeout(() => {
            resetSequence()
        }, 900)
    }

    function goTo(path: string, label: string) {
        navigate(path)

        showToast({
            type: "info",
            title: "Atalho executado",
            description: `Abrindo ${label}.`,
        })
    }

    function focusNewTask() {
        navigate("/tasks", {
            state: {
                focusNewTask: true,
                shortcutAt: Date.now(),
            },
        })

        window.setTimeout(() => {
            window.dispatchEvent(new CustomEvent("lynflow-focus-new-task"))
        }, 120)

        showToast({
            type: "info",
            title: "Nova tarefa",
            description: "Campo de criação de tarefa selecionado.",
        })
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.repeat) return
            if (isEditableElement(event.target)) return
            if (event.ctrlKey || event.metaKey || event.altKey) return

            const key = event.key.toLowerCase()

            if (key === "n") {
                event.preventDefault()
                resetSequence()
                focusNewTask()
                return
            }

            if (key === "g") {
                event.preventDefault()
                startSequence("g")
                return
            }

            if (sequenceRef.current === "g") {
                const routes: Record<string, { path: string; label: string }> = {
                    d: {
                        path: "/dashboard",
                        label: "Dashboard",
                    },
                    t: {
                        path: "/tasks",
                        label: "Tasks",
                    },
                    g: {
                        path: "/goals",
                        label: "Goals",
                    },
                    i: {
                        path: "/insights",
                        label: "AI Insights",
                    },
                    a: {
                        path: "/activity",
                        label: "Activity",
                    },
                    p: {
                        path: "/profile",
                        label: "Profile",
                    },
                    s: {
                        path: "/settings",
                        label: "Settings",
                    },
                }

                const route = routes[key]

                if (route) {
                    event.preventDefault()
                    resetSequence()
                    goTo(route.path, route.label)
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)

            if (timerRef.current) {
                window.clearTimeout(timerRef.current)
            }
        }
    }, [navigate, showToast])

    return null
}