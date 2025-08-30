import { createFileRoute } from "@tanstack/react-router"
import { AreaSelector } from "@/components/area-selection/AreaSelector"

export const Route = createFileRoute("/area-selection")({
  component: AreaSelectionPage,
})

function AreaSelectionPage() {
  return <AreaSelector />
}