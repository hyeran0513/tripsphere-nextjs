export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <div className="skeleton h-8 w-40" />
      <div className="skeleton h-48 w-full rounded-lg" />
      <div className="skeleton h-32 w-full rounded-lg" />
    </div>
  )
}
