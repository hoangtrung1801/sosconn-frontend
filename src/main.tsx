import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/components/auth/AuthProvider.tsx";
import "./lib/i18n.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        {/* Uncomment the line below to enable React Query Devtools */}
        {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
