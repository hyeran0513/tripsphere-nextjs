"use client"

import { Users } from "lucide-react"

type GuestCounterFieldProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function GuestCounterField({
  value,
  onChange,
  min = 1,
  max = 20,
  className,
}: GuestCounterFieldProps) {
  return (
    <div className={`form-control ${className ?? "min-w-0 flex-1"}`}>
      <label className="label py-0.5">
        <span className="label-text flex items-center gap-1 text-xs font-semibold">
          <Users className="size-3.5" />
          인원
        </span>
      </label>

      <div className="join w-full">
        {/* 감소 버튼 */}
        <button
          type="button"
          className="btn btn-outline btn-sm join-item"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          -
        </button>

        {/* 인원 수 입력 */}
        <input
          type="number"
          className="join-item w-full border border-base-300 text-center text-sm outline-none"
          value={value || ""}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          onBlur={(e) => {
            const v = Number(e.target.value)
            if (!v || v < min) onChange(min)
            else if (v > max) onChange(max)
          }}
        />

        {/* 증가 버튼 */}
        <button
          type="button"
          className="btn btn-outline btn-sm join-item"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  )
}
