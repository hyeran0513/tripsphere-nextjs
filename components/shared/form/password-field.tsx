"use client"

import type { LucideIcon } from "lucide-react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useId, useState } from "react"
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import { daisyControlShellClassNames } from "@/components/shared/form/daisy-control-shell"

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  disabled?: boolean
  placeholder?: string
  autoComplete?: string
  id?: string
  icon?: LucideIcon
}

export function PasswordField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  placeholder,
  autoComplete,
  id,
  icon: Icon = Lock,
}: PasswordFieldProps<TFieldValues>) {
  const reactId = useId()
  const inputId = id ?? `${reactId}-${String(name)}`
  const [visible, setVisible] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="form-control w-full">
          <label className="label py-1" htmlFor={inputId}>
            <span className="label-text font-medium">{label}</span>
          </label>
          <div className="flex w-full min-w-0 items-stretch gap-2">
            <div className={`${daisyControlShellClassNames(!!fieldState.error)} min-w-0 flex-1`}>
              <Icon className="text-base-content/40 size-[1.1em] shrink-0" aria-hidden />
              {visible ? (
                <input
                  {...field}
                  id={inputId}
                  type="text"
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  spellCheck={false}
                  className="min-w-0 grow border-0 bg-transparent outline-none focus:ring-0"
                  disabled={disabled}
                />
              ) : (
                <input
                  {...field}
                  id={inputId}
                  type="password"
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  spellCheck={false}
                  className="min-w-0 grow border-0 bg-transparent outline-none focus:ring-0"
                  disabled={disabled}
                />
              )}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm w-10 shrink-0 self-stretch rounded-lg border border-base-content/15 px-0 hover:border-base-content/25 hover:bg-base-200/70 focus-visible:border-primary/50 focus-visible:outline-none"
              onClick={() => setVisible((v) => !v)}
              disabled={disabled}
              aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
              aria-pressed={visible}
            >
              {visible ? (
                <EyeOff className="size-4 opacity-70" aria-hidden />
              ) : (
                <Eye className="size-4 opacity-70" aria-hidden />
              )}
            </button>
          </div>
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
