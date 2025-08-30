import { createFileRoute } from '@tanstack/react-router'
import { EmergencyManagementPage } from '@/components/emergency-management/EmergencyManagementPage'

type EmergencyManagementSearch = {
  area?: string
}

export const Route = createFileRoute('/emergency-management')({
  component: EmergencyManagement,
  validateSearch: (search: Record<string, unknown>): EmergencyManagementSearch => {
    return {
      area: search.area as string | undefined,
    }
  },
})

function EmergencyManagement() {
  const { area } = Route.useSearch()
  return <EmergencyManagementPage selectedArea={area} />
}