import { createFileRoute } from '@tanstack/react-router'
import EOPListPage from '@/components/eop/EOPListPage'

export const Route = createFileRoute('/eop/')({
  component: EOPListPage,
})