import { Suspense } from "react"

import { SearchResult } from "@/components/shared/feature/search/search-result"
import { SearchFallback } from "@/components/shared/feature/search/search-fallback"

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResult />
    </Suspense>
  )
}
