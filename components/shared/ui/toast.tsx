"use client"

type ToastContainerProps = {
  toasts: { id: number; message: string }[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="toast toast-end toast-bottom z-50">
      {toasts.map((t) => (
        <div key={t.id} className="alert alert-info shadow-lg">
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
