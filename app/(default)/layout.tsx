import { Header } from "@/components/shared/layout/header"
import { Footer } from "@/components/shared/layout/footer"

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* 헤더 */}
      <Header />

      {/* 메인 */}
      <main className="min-h-screen bg-base-100 pb-12">{children}</main>

      {/* 푸터 */}
      <Footer />
    </>
  )
}
