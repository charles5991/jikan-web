import { cn } from "@/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-gray-800/60 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className,
      )}
    />
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="group relative">
      <div className="overflow-hidden rounded-md transition-all duration-300">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-b from-gray-700/30 to-gray-900/60">
          <Skeleton className="h-full w-full opacity-50" />

          {/* Content overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function AnimeDetailsSkeleton() {
  return (
    <div className="w-full">
      {/* Hero skeleton with background gradient */}
      <div className="relative h-[70vh] w-full overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#141414]">
        <div className="absolute inset-0 opacity-30 backdrop-blur-sm">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />

        <header className="absolute top-0 right-0 left-0 z-10">
          <div className="container mx-auto flex items-center gap-4 px-4 py-4 md:px-16">
            <div className="rounded-full bg-black/30 p-2">
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        </header>

        <div className="absolute right-0 bottom-0 left-0 z-10 p-4 md:p-16">
          <Skeleton className="mb-2 h-8 w-3/4 md:h-10 lg:h-12" />
          <Skeleton className="mb-4 h-6 w-1/2 md:h-8" />
          <div className="mb-4 flex flex-wrap gap-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="mb-6 flex gap-3">
            <Skeleton className="h-10 w-32 rounded" />
            <Skeleton className="h-10 w-32 rounded" />
          </div>
          <Skeleton className="h-24 w-full max-w-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-3">
            <Skeleton className="mb-4 h-8 w-48" />
            <Skeleton className="mb-6 h-40 w-full" />

            <div className="mb-4">
              <Skeleton className="mb-2 h-5 w-24" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-7 w-16 rounded" />
                ))}
              </div>
            </div>

            <Skeleton className="mt-10 mb-4 h-8 w-48" />
            <div className="mx-auto max-w-3xl overflow-hidden rounded-md shadow-lg shadow-black/30">
              <div className="relative h-0 pb-[56.25%]">
                <Skeleton className="absolute inset-0 h-full w-full" />
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="rounded-md border border-gray-800 bg-[#0c0c0c] p-5">
              <Skeleton className="mb-4 h-6 w-24" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-md bg-gray-800/30 p-3">
                    <Skeleton className="mx-auto mb-2 h-4 w-3/4" />
                    <Skeleton className="mx-auto h-6 w-1/2" />
                  </div>
                ))}
              </div>

              <Skeleton className="mt-5 h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
