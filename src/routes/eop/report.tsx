import { createFileRoute } from "@tanstack/react-router"
import ReportDisplayPage from "@/components/eop/ReportDisplayPage"

export const Route = createFileRoute("/eop/report")({
  component: ReportDisplayPage,
})