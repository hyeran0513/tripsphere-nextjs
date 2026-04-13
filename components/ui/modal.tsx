"use client"

import type { ReactNode } from "react"

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  boxClassName?: string
  backdropClassName?: string
}

export function Modal({ open, onClose, children, boxClassName, backdropClassName }: ModalProps) {
  if (!open) return null

  return (
    <dialog className="modal modal-open">
      <div className={`modal-box${boxClassName ? ` ${boxClassName}` : ""}`}>{children}</div>

      <form
        method="dialog"
        className={`modal-backdrop${backdropClassName ? ` ${backdropClassName}` : ""}`}
      >
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  )
}
