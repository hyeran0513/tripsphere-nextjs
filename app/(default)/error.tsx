"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-base-content/60">
      {/* 에러 아이콘 */}
      <AlertTriangle className="mb-3 size-12 text-error" />

      {/* 에러 제목 */}
      <p className="text-lg font-medium">문제가 발생했습니다</p>

      {/* 에러 메시지 */}
      {error.message && <p className="mt-1 text-sm text-base-content/50">{error.message}</p>}

      {/* 다시 시도 버튼 */}
      <button type="button" className="btn btn-primary btn-sm mt-4" onClick={reset}>
        다시 시도
      </button>
    </div>
  )
}
