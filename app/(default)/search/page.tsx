import { SearchResult } from "@/components/shared/feature/search/search-result"
import { SearchFallback } from "@/components/shared/feature/search/search-fallback"
import { PageBoundary } from "@/components/ui/page-boundary"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "검색 | TripSphere",
}

export default function SearchPage() {
  return (
    <PageBoundary loadingFallback={<SearchFallback />}>
      <SearchResult />
    </PageBoundary>
  )
}
