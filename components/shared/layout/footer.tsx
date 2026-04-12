"use client"

import Link from "next/link"
import { PATH } from "@/constants/path"
import { useTermsQuery } from "@/hooks/queries/use-terms-query"

export function Footer() {
  const { data: terms } = useTermsQuery()

  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center">
        <div className="text-xs text-base-content/40">
          &copy; {new Date().getFullYear()} TripSphere. All rights reserved.
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/60">
          {terms?.map((term) => (
            <Link
              key={term.id}
              href={`${PATH.TERMS}?id=${term.id}`}
              className="hover:text-base-content hover:underline"
            >
              {term.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
