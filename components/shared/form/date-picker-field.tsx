"use client"

import { CalendarDays } from "lucide-react"

type DatePickerFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  minDate?: Date
}

export function DatePickerField({ label, value, onChange, minDate }: DatePickerFieldProps) {
  const minStr = minDate
    ? `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, "0")}-${String(minDate.getDate()).padStart(2, "0")}`
    : undefined

  return (
    <div className="form-control min-w-0 flex-1">
      <label className="label py-0.5">
        <span className="label-text flex items-center gap-1 text-xs font-semibold">
          <CalendarDays className="size-3.5" />
          {label}
        </span>
      </label>
      <input
        type="date"
        className="input input-bordered input-sm w-full"
        value={value}
        min={minStr}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
