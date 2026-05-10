import { createBrowserRouter, Outlet } from "react-router";
import { LeftSidebar } from "./components/LeftSidebar";

import { HomeDashboard } from "./pages/HomeDashboard";
import { PathToPro } from "./pages/PathToPro";
import { CoachTerminal } from "./pages/CoachTerminal";

function RootLayout() {
  return (
    <div className="dark min-h-screen bg-[#0a0a0f] flex">
      <LeftSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomeDashboard },
      { path: "path-to-pro", Component: PathToPro },
      { path: "coach-terminal", Component: CoachTerminal },
    ],
  },
]);
