export function SearchFallback() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex justify-center">
        <div className="skeleton h-20 w-full max-w-6xl rounded-2xl" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
