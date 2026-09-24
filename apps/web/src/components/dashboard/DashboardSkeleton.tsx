export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card-compact animate-pulse">
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="flex items-center flex-wrap gap-1.5">
                  <div className="h-3 bg-neutral-200 rounded-full w-16" />
                  <div className="h-3 bg-neutral-200 rounded-full w-20" />
                  <div className="h-3 bg-neutral-200 rounded-full w-24" />
                </div>
              </div>
              <div className="h-8 w-8 bg-neutral-200 rounded-lg flex-shrink-0" />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-baseline justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="h-2.5 bg-neutral-200 rounded w-1/4" />
                <div className="h-7 bg-neutral-200 rounded w-1/3" />
              </div>
              <div className="flex-shrink-0 text-right space-y-0.5">
                <div className="h-2.5 bg-neutral-200 rounded w-1/4" />
                <div className="h-6 bg-neutral-200 rounded w-20" />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-neutral-200 flex-1 min-w-0">
                <div className="h-3.5 w-3.5 bg-neutral-200 rounded flex-shrink-0" />
                <div className="h-3 bg-neutral-200 rounded w-40 flex-1" />
              </div>
              <div className="h-6 w-16 bg-neutral-200 rounded flex-shrink-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}