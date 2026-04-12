export function SearchFallback() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex justify-center">
        <div className="skeleton h-20 w-full max-w-4xl rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card border border-base-300 bg-base-100">
            <figure className="skeleton h-48 w-full rounded-b-none" />
            <div className="card-body gap-3 p-4">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
