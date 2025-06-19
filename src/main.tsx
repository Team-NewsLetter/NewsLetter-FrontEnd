import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// // ✅ MSW 적용
// if (import.meta.env.DEV) {
//   const { worker } = await import("./mocks/browser");
//   worker.start();
// }

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="dark:bg-gray-900 dark:text-white min-h-screen">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </div>
  </StrictMode>
);
