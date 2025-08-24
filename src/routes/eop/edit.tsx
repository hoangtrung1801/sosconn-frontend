import { createFileRoute } from "@tanstack/react-router"
import EditReportPage from "@/components/eop/EditReportPage"

export const Route = createFileRoute("/eop/edit")({
  component: EditReportPage,
})