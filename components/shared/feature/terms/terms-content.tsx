"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FileText } from "lucide-react"

import { PATH } from "@/constants/path"
import { useTermsQuery, useTermQuery } from "@/hooks/queries/use-terms-query"

export function TermsContent() {
  const searchParams = useSearchParams()
  const termId = searchParams.get("id")

  const { data: terms, isLoading: termsLoading } = useTermsQuery()
  const { data: selectedTerm, isLoading: termLoading } = useTermQuery(termId)

  if (termsLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-64 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-2xl font-bold">이용약관</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 약관 목록 (사이드) */}
        <aside className="w-full shrink-0 lg:w-60">
          <ul className="menu w-full rounded-lg border border-base-300 bg-base-100 p-2">
            {terms?.map((t) => (
              <li key={t.id}>
                <Link
                  href={`${PATH.TERMS}?id=${t.id}`}
                  className={`flex items-center gap-2 ${termId === t.id ? "active" : ""}`}
                >
                  <FileText className="size-4" />
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* 약관 내용 */}
        <main className="min-w-0 flex-1">
          {termLoading ? (
            <div className="skeleton h-64 w-full rounded-lg" />
          ) : selectedTerm ? (
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h2 className="card-title text-lg">{selectedTerm.title}</h2>
                <div className="divider my-1" />
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-base-content/80">
                  {selectedTerm.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-base-content/50">
              <FileText className="mb-3 size-12" />
              <p className="text-lg font-medium">약관을 선택해주세요</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
