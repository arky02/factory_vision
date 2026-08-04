import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { AppLayout } from "@/components/layout/app-layout";
import { HistoryPage } from "@/features/history/history-page";
import { InspectPage } from "@/features/inspect/inspect-page";
import { LivePage } from "@/features/live/live-page";

import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 10_000 },
  },
});

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/inspect" replace /> },
      { path: "/inspect", element: <InspectPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/dashboard", element: <Navigate to="/history" replace /> },
      { path: "/live", element: <LivePage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  </StrictMode>,
);
