import Homepage from "@/components/home/Homepage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: Homepage,
});
