import { createRootRoute, Outlet } from '@tanstack/react-router'
import "@/global.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SetCurrentRootPath from '@/components/providers/setCurrentRootPath'

export const Route = createRootRoute({
  component: () => {

    const queryClient = new QueryClient()

    return (
      <QueryClientProvider client={queryClient}>
        <SetCurrentRootPath />
        <Outlet />
      </QueryClientProvider>
    )
  }
})
