"use client"

import type { LucideIcon } from "lucide-react"
import { useId } from "react"
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import { daisyControlShellClassNames } from "@/components/shared/form/daisy-control-shell"

type InputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  type?: React.HTMLInputTypeAttribute
  disabled?: boolean
  placeholder?: string
  autoComplete?: string
  id?: string
  icon?: LucideIcon
}

export function InputField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  disabled = false,
  placeholder,
  autoComplete,
  id,
  icon: Icon,
}: InputFieldProps<TFieldValues>) {
  const reactId = useId()
  const inputId = id ?? `${reactId}-${String(name)}`

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="form-control w-full">
          {/* 라벨 */}
          <label className="label py-1" htmlFor={inputId}>
            <span className="label-text font-medium">{label}</span>
          </label>

          <div className={daisyControlShellClassNames(!!fieldState.error)}>
            {/* 아이콘 */}
            {Icon ? (
              <Icon className="text-base-content/40 size-[1.1em] shrink-0" aria-hidden />
            ) : null}

            {/* 입력 필드 */}
            <input
              {...field}
              id={inputId}
              type={type}
              autoComplete={autoComplete}
              placeholder={placeholder}
              className="min-w-0 grow border-0 bg-transparent outline-none focus:ring-0"
              disabled={disabled}
            />
          </div>

          {/* 에러 메시지 */}
          {fieldState.error ? (
            <p className="label-text-alt text-error mt-1 px-0" role="alert">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  )
}
