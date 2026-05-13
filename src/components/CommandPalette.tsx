import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
    CheckSquare,
    Command,
    History,
    LayoutDashboard,
    LogOut,
    Search,
    Settings,
    Sparkles,
    Target,
    UserRound,
    X,
    type LucideIcon,
} from "lucide-react"
import { useAuth } from "../hooks/useAuth"

type CommandItem = {
    id: string
    label: string
    description: string
    path?: string
    icon: LucideIcon
    keywords: string[]
    action?: () => void
    danger?: boolean
}

export function CommandPalette() {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)

    function openPalette() {
        setIsOpen(true)
    }

    function closePalette() {
        setIsOpen(false)
        setSearch("")
        setSelectedIndex(0)
    }

    const handleLogout = useCallback(async () => {
        await logout()
        closePalette()
        navigate("/login")
    }, [logout, navigate])

    const commands: CommandItem[] = useMemo(
        () => [
            {
                id: "dashboard",
                label: "Dashboard",
                description: "Visão geral de produtividade e analytics.",
                path: "/dashboard",
                icon: LayoutDashboard,
                keywords: ["home", "inicio", "analytics", "resumo"],
            },
            {
                id: "tasks",
                label: "Tasks",
                description: "Criar, editar, filtrar e organizar tarefas.",
                path: "/tasks",
                icon: CheckSquare,
                keywords: ["tarefas", "lista", "todo", "task"],
            },
            {
                id: "goals",
                label: "Goals",
                description: "Acompanhar metas e progresso do MVP.",
                path: "/goals",
                icon: Target,
                keywords: ["metas", "objetivos", "progresso"],
            },
            {
                id: "insights",
                label: "AI Insights",
                description: "Sugestões inteligentes simuladas para sua rotina.",
                path: "/insights",
                icon: Sparkles,
                keywords: ["ia", "ai", "sugestao", "insights"],
            },
            {
                id: "activity",
                label: "Activity",
                description: "Histórico completo de ações feitas no app.",
                path: "/activity",
                icon: History,
                keywords: ["historico", "atividade", "log"],
            },
            {
                id: "profile",
                label: "Profile",
                description: "Perfil local, produtividade e dados da conta.",
                path: "/profile",
                icon: UserRound,
                keywords: ["perfil", "usuario", "conta"],
            },
            {
                id: "settings",
                label: "Settings",
                description: "Tema, dados locais, demo e histórico.",
                path: "/settings",
                icon: Settings,
                keywords: ["configuracoes", "preferencias", "tema"],
            },
            {
                id: "logout",
                label: "Sair da conta",
                description: "Encerrar a sessão local do Lynflow.",
                icon: LogOut,
                keywords: ["logout", "sair", "encerrar"],
                action: handleLogout,
                danger: true,
            },
        ],
        [handleLogout]
    )

    const filteredCommands = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        if (!normalizedSearch) {
            return commands
        }

        return commands.filter((command) => {
            const searchableText = [
                command.label,
                command.description,
                ...command.keywords,
            ]
                .join(" ")
                .toLowerCase()

            return searchableText.includes(normalizedSearch)
        })
    }, [commands, search])

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const isCommandShortcut =
                (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k"

            if (isCommandShortcut) {
                event.preventDefault()
                setIsOpen((currentValue) => !currentValue)
            }

            if (event.key === "Escape") {
                closePalette()
            }
        }

        function handleOpenCommandPalette() {
            openPalette()
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener(
            "lynflow-open-command-palette",
            handleOpenCommandPalette
        )

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener(
                "lynflow-open-command-palette",
                handleOpenCommandPalette
            )
        }
    }, [])

    useEffect(() => {
        if (!isOpen) return

        window.setTimeout(() => {
            inputRef.current?.focus()
        }, 50)
    }, [isOpen])

    function executeCommand(command: CommandItem) {
        if (command.action) {
            command.action()
            return
        }

        if (command.path) {
            navigate(command.path)
            closePalette()
        }
    }

    function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "ArrowDown") {
            event.preventDefault()

            setSelectedIndex((currentIndex) => {
                if (filteredCommands.length === 0) return 0

                return currentIndex === filteredCommands.length - 1
                    ? 0
                    : currentIndex + 1
            })
        }

        if (event.key === "ArrowUp") {
            event.preventDefault()

            setSelectedIndex((currentIndex) => {
                if (filteredCommands.length === 0) return 0

                return currentIndex === 0
                    ? filteredCommands.length - 1
                    : currentIndex - 1
            })
        }

        if (event.key === "Enter") {
            event.preventDefault()

            const selectedCommand = filteredCommands[selectedIndex]

            if (selectedCommand) {
                executeCommand(selectedCommand)
            }
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Fechar command palette"
                        title="Fechar command palette"
                        className="fixed inset-0 z-[9996] bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePalette}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="command-palette-title"
                        initial={{ opacity: 0, y: -18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -18, scale: 0.98 }}
                        className="fixed left-1/2 top-8 z-[9997] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] shadow-2xl shadow-black/30"
                    >
                        <div className="border-b border-[var(--border)] p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Command size={18} className="ly-accent" />

                                    <h2 id="command-palette-title" className="font-semibold">
                                        Command Palette
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={closePalette}
                                    aria-label="Fechar"
                                    title="Fechar"
                                    className="rounded-xl p-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="relative">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-soft)]"
                                />

                                <input
                                    ref={inputRef}
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value)
                                        setSelectedIndex(0)
                                    }}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder="Buscar página ou ação..."
                                    title="Buscar comando"
                                    aria-label="Buscar comando"
                                    className="ly-input rounded-2xl py-3 pl-11 pr-4"
                                />
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-3">
                            {filteredCommands.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="font-medium">Nenhum comando encontrado</p>
                                    <p className="ly-muted-soft mt-2 text-sm">
                                        Tente buscar por página, ação ou palavra-chave.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredCommands.map((command, index) => {
                                        const Icon = command.icon
                                        const isSelected = index === selectedIndex
                                        const isCurrentPage = command.path === location.pathname

                                        return (
                                            <button
                                                key={command.id}
                                                type="button"
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                onClick={() => executeCommand(command)}
                                                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${isSelected
                                                        ? "bg-[var(--surface)]"
                                                        : "hover:bg-[var(--surface)]"
                                                    }`}
                                            >
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${command.danger
                                                            ? "border-red-500/20 bg-red-500/10 text-red-500"
                                                            : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]"
                                                        }`}
                                                >
                                                    <Icon size={18} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p
                                                            className={`font-medium ${command.danger ? "text-red-500" : ""
                                                                }`}
                                                        >
                                                            {command.label}
                                                        </p>

                                                        {isCurrentPage && (
                                                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-500">
                                                                Atual
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="ly-muted-soft mt-1 truncate text-sm">
                                                        {command.description}
                                                    </p>
                                                </div>

                                                <span className="hidden rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted-soft)] sm:inline">
                                                    Enter
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted-soft)]">
                            <span>Use ↑ ↓ para navegar</span>
                            <span>Esc para fechar</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
