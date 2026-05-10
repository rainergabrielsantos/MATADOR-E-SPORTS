import { createBrowserRouter, Outlet, Navigate } from "react-router";
import { LeftSidebar } from "./components/LeftSidebar";

import { HomeDashboard } from "./pages/HomeDashboard";
import { PathToPro } from "./pages/PathToPro";
import { CoachTerminal } from "./pages/CoachTerminal";
import { CommunityPage } from "./pages/CommunityPage";
import { EventsPage } from "./pages/EventsPage";
import { RosterManager } from "./pages/RosterManager";
import { ScoutingBoard } from "./pages/ScoutingBoard";
import { LoginPage } from "./pages/LoginPage";

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
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: RootLayout,
    children: [
      { index: true, Component: HomeDashboard },
      { path: "path-to-pro", Component: PathToPro },
      { path: "events", Component: EventsPage },
      { path: "community", Component: CommunityPage },
      {
        path: "coach-terminal",
        children: [
          { index: true, Component: CoachTerminal },
          { path: "roster", Component: RosterManager },
          { path: "scouting", Component: ScoutingBoard },
        ],
      },
    ],
  },
  // Redirect any unknown routes to login
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
