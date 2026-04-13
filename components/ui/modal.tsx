"use client"

import { useEffect, type ReactNode } from "react"

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  boxClassName?: string
  backdropClassName?: string
}

const DEFAULT_BOX_LAYOUT = "w-[91.6667%] max-w-lg p-6"

export function Modal({ open, onClose, children, boxClassName, backdropClassName }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)

    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* 배경 */}
      <div
        className={`absolute inset-0 bg-black/40${backdropClassName ? ` ${backdropClassName}` : ""}`}
        onClick={onClose}
        aria-hidden
      />

      {/* 본문 */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 max-h-[100vh] overflow-y-auto rounded-box bg-base-100 shadow-2xl ${boxClassName ?? DEFAULT_BOX_LAYOUT}`}
      >
        {children}
      </div>
    </div>
  )
}
