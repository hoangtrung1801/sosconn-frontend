import { Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";

export default function RootLayout() {
  const handleNavItemClick = (href: string) => {
    // Handle navigation - you can integrate with TanStack Router navigation here
    console.log("Navigate to:", href);
  };

  const handleInfoItemClick = (item: string) => {
    console.log("Info item clicked:", item);
  };

  const handleNotificationItemClick = (item: string) => {
    console.log("Notification item clicked:", item);
  };

  const handleUserItemClick = (item: string) => {
    console.log("User item clicked:", item);
  };

  return (
    <>
      <Navbar
        userName="Emergency User"
        userEmail="user@vku-emergency.vn"
        notificationCount={2}
        onNavItemClick={handleNavItemClick}
        onInfoItemClick={handleInfoItemClick}
        onNotificationItemClick={handleNotificationItemClick}
        onUserItemClick={handleUserItemClick}
      />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
}
