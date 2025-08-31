import { Outlet, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import RouteGuard from "@/components/auth/RouteGuard";

export default function RootLayout() {
  const navigate = useNavigate();

  // Emergency simulation - same as in Homepage
  const isEmergency = true;
  const emergencyLocation = "Da Nang City";
  const emergencyType = "Severe Flooding";

  const handleNavItemClick = (href: string) => {
    // Handle navigation with TanStack Router
    navigate({ to: href });
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
        notificationCount={5}
        isEmergency={isEmergency}
        emergencyLocation={emergencyLocation}
        emergencyType={emergencyType}
        onNavItemClick={handleNavItemClick}
        onInfoItemClick={handleInfoItemClick}
        onNotificationItemClick={handleNotificationItemClick}
        onUserItemClick={handleUserItemClick}
      />
      <main className="min-h-screen">
        <RouteGuard>
          <Outlet />
        </RouteGuard>
      </main>
    </>
  );
}
