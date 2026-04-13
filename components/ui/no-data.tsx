import { Inbox } from "lucide-react"
import type { ReactNode } from "react"

type NoDataProps = {
  icon?: ReactNode
  title: string
  description?: string
  className?: string
  children?: ReactNode
}

export function NoData({
  icon = <Inbox className="mb-3 size-12" />,
  title,
  description,
  className = "py-20",
  children,
}: NoDataProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-base-content/50 ${className}`}>
      {icon}
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
      {children}
    </div>
  )
}
