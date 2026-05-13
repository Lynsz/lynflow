import { Skeleton } from "../ui/Skeleton"

export function TasksSkeleton() {
    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <header className="mb-8">
                <Skeleton className="mb-3 h-4 w-28" />
                <Skeleton className="mb-3 h-10 w-40" />
                <Skeleton className="h-5 w-[520px] max-w-full" />
            </header>

            <Skeleton className="mb-6 h-40 rounded-3xl" />
            <Skeleton className="mb-6 h-52 rounded-3xl" />

            <section className="ly-card rounded-3xl p-5">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Skeleton className="mb-3 h-6 w-40" />
                        <Skeleton className="h-4 w-80 max-w-full" />
                    </div>

                    <Skeleton className="h-8 w-40" />
                </div>

                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-24 rounded-2xl" />
                    ))}
                </div>
            </section>
        </div>
    )
}