import { TermsContent } from "@/components/shared/feature/terms/terms-content"
import { TermsFallback } from "@/components/shared/feature/terms/terms-fallback"
import { PageBoundary } from "@/components/ui/page-boundary"

export default function TermsPage() {
  return (
    <PageBoundary loadingFallback={<TermsFallback />}>
      <TermsContent />
    </PageBoundary>
  )
}
