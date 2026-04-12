/**
 * Shared DaisyUI `.input` wrapper: border color tokens + focus/hover without
 * stacking extra Tailwind rings on top of Daisy’s outline.
 */
export function daisyControlShellClassNames(hasError: boolean): string {
  const shell =
    "input flex w-full min-w-0 items-center gap-2 transition-[outline-color,box-shadow,border-color] duration-200 ease-out"

  if (hasError) {
    return `${shell} input-error`
  }

  return [
    shell,
    "[--input-color:color-mix(in_oklab,var(--color-base-content)_22%,transparent)]",
    "hover:[--input-color:color-mix(in_oklab,var(--color-base-content)_34%,transparent)]",
    "focus-within:[--input-color:var(--color-primary)]",
  ].join(" ")
}
