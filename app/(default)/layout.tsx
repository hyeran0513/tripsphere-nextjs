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
      {children}
      <Footer />
    </>
  )
}
