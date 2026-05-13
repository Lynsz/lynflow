import { useEffect, useMemo, useState } from "react"

type InstallPromptOutcome = "accepted" | "dismissed"

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{
        outcome: InstallPromptOutcome
        platform: string
    }>
}

type NavigatorWithStandalone = Navigator & {
    standalone?: boolean
}

function canUseWindow() {
    return typeof window !== "undefined"
}

function canUseNavigator() {
    return typeof navigator !== "undefined"
}

function getIsStandalone() {
    if (!canUseWindow()) {
        return false
    }

    const isDisplayModeStandalone =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches

    const isIosStandalone = Boolean(
        (window.navigator as NavigatorWithStandalone).standalone
    )

    return isDisplayModeStandalone || isIosStandalone
}

function getIsOnline() {
    if (!canUseNavigator()) {
        return true
    }

    return navigator.onLine
}

function getIsServiceWorkerSupported() {
    return canUseNavigator() && "serviceWorker" in navigator
}

export function useInstallPrompt() {
    const [installPrompt, setInstallPrompt] =
        useState<BeforeInstallPromptEvent | null>(null)

    const [isStandalone, setIsStandalone] = useState(() => getIsStandalone())
    const [isInstalled, setIsInstalled] = useState(false)
    const [isOnline, setIsOnline] = useState(() => getIsOnline())
    const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false)

    const isServiceWorkerSupported = getIsServiceWorkerSupported()

    useEffect(() => {
        if (!canUseWindow() || typeof window.matchMedia !== "function") {
            return
        }

        const displayModeQuery = window.matchMedia("(display-mode: standalone)")

        function handleDisplayModeChange() {
            setIsStandalone(getIsStandalone())
        }

        displayModeQuery.addEventListener("change", handleDisplayModeChange)

        return () => {
            displayModeQuery.removeEventListener("change", handleDisplayModeChange)
        }
    }, [])

    useEffect(() => {
        function handleBeforeInstallPrompt(event: Event) {
            event.preventDefault()
            setInstallPrompt(event as BeforeInstallPromptEvent)
        }

        function handleAppInstalled() {
            setInstallPrompt(null)
            setIsInstalled(true)
            setIsStandalone(true)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.addEventListener("appinstalled", handleAppInstalled)

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            )
            window.removeEventListener("appinstalled", handleAppInstalled)
        }
    }, [])

    useEffect(() => {
        function handleOnline() {
            setIsOnline(true)
        }

        function handleOffline() {
            setIsOnline(false)
        }

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    useEffect(() => {
        if (!isServiceWorkerSupported) {
            return
        }

        let isMounted = true

        navigator.serviceWorker.ready
            .then(() => {
                if (isMounted) {
                    setIsServiceWorkerReady(true)
                }
            })
            .catch(() => {
                if (isMounted) {
                    setIsServiceWorkerReady(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [isServiceWorkerSupported])

    const canInstall = Boolean(installPrompt) && !isStandalone && !isInstalled

    async function promptInstall() {
        if (!installPrompt) {
            return false
        }

        await installPrompt.prompt()

        const choice = await installPrompt.userChoice
        const wasAccepted = choice.outcome === "accepted"

        if (wasAccepted) {
            setIsInstalled(true)
            setIsStandalone(true)
        }

        setInstallPrompt(null)

        return wasAccepted
    }

    const installStatusLabel = useMemo(() => {
        if (isStandalone || isInstalled) {
            return "Instalado"
        }

        if (canInstall) {
            return "Disponível para instalação"
        }

        return "Indisponível neste navegador"
    }, [canInstall, isInstalled, isStandalone])

    return {
        canInstall,
        installStatusLabel,
        isInstalled,
        isOnline,
        isServiceWorkerReady,
        isServiceWorkerSupported,
        isStandalone,
        promptInstall,
    }
}