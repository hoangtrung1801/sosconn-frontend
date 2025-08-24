import { createFileRoute } from "@tanstack/react-router"
import CreateEOPReportPage from "@/components/eop/CreateEOPReportPage"

export const Route = createFileRoute("/eop/create")({
  component: CreateEOPReportPage,
})