import { SearchResult } from "@/components/shared/feature/search/search-result"
import { SearchFallback } from "@/components/shared/feature/search/search-fallback"
import { PageBoundary } from "@/components/ui/page-boundary"

export default function SearchPage() {
  return (
    <PageBoundary loadingFallback={<SearchFallback />}>
      <SearchResult />
    </PageBoundary>
  )
}
