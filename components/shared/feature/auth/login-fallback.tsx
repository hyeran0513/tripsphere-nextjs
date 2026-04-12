export function LoginFallback() {
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="skeleton h-8 w-32" />
        <div className="skeleton h-4 w-56" />

        <div className="mt-4 space-y-4">
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
