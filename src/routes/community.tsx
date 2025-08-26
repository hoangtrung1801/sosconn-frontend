import CommunityPage from "@/components/community/CommunityPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
});