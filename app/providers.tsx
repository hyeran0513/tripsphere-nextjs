"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

type Props = {
  children: ReactNode
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  )
}
