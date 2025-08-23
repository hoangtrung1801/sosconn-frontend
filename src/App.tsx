import { routeTree } from "./routeTree.gen";
import { createRouter, Navigate, RouterProvider } from "@tanstack/react-router";

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultNotFoundComponent: () => <Navigate to="/home" />,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
