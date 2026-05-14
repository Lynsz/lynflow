export function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-2xl focus:bg-[var(--primary)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-2xl"
        >
            Pular para o conteúdo principal
        </a>
    )
}