import { Header } from "@/components/shared/layout/header"
import { Footer } from "@/components/shared/layout/footer"

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-base-100 pb-12">{children}</main>
      <Footer />
    </>
  )
}
