import CitizenDashboard from "@/components/citizen/CitizenDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/citizen")({
  component: CitizenDashboard,
});