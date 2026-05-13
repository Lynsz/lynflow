import { Skeleton } from "../ui/Skeleton"

export function DashboardSkeleton() {
    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Skeleton className="mb-3 h-4 w-28" />
                    <Skeleton className="mb-3 h-10 w-64" />
                    <Skeleton className="h-5 w-80 max-w-full" />
                </div>

                <Skeleton className="h-12 w-40" />
            </header>

            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-36 rounded-3xl" />
                ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <Skeleton className="h-[390px] rounded-3xl" />

                <aside className="space-y-6">
                    <Skeleton className="h-48 rounded-3xl" />
                    <Skeleton className="h-52 rounded-3xl" />
                </aside>
            </section>
        </div>
    )
}