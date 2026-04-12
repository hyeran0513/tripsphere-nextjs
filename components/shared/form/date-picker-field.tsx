"use client"

import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarDays } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"

type DatePickerFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  minDate?: Date
}

export function DatePickerField({ label, value, onChange, minDate }: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = value ? new Date(value + "T00:00:00") : undefined

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="form-control relative min-w-0 flex-1" ref={ref}>
      <label className="label py-0.5">
        <span className="label-text flex items-center gap-1 text-xs font-semibold">
          <CalendarDays className="size-3.5" />
          {label}
        </span>
      </label>
      <button
        type="button"
        className="input input-bordered input-sm flex w-full items-center justify-start gap-2 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={value ? "" : "text-base-content/40"}>
          {value ? format(selected!, "yyyy.MM.dd") : "날짜 선택"}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 rounded-xl border border-base-300 bg-base-100 p-2 shadow-xl">
          <DayPicker
            mode="single"
            locale={ko}
            selected={selected}
            disabled={minDate ? { before: minDate } : undefined}
            onSelect={(day) => {
              if (day) {
                onChange(format(day, "yyyy-MM-dd"))
              }
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
