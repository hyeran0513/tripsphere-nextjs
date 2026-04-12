export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-base-200 p-6">
      {children}
    </section>
  )
}
