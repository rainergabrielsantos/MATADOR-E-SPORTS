import { createBrowserRouter, Outlet, Navigate } from "react-router";
import { LeftSidebar } from "./components/LeftSidebar";
import { ProtectedRoute } from "./hooks/ProtectedRoute";

import { HomeDashboard } from "./pages/HomeDashboard";
import { PathToPro } from "./pages/PathToPro";
import { CoachTerminal } from "./pages/CoachTerminal";
import { CommunityPage } from "./pages/CommunityPage";
import { EventsPage } from "./pages/EventsPage";
import { RosterManager } from "./pages/RosterManager";
import { ScoutingBoard } from "./pages/ScoutingBoard";
import { LoginPage } from "./pages/LoginPage";
import { TeamDashboard } from "./pages/TeamDashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProfilePage } from "./pages/ProfilePage";
import { MyEventsPage } from "./pages/MyEventsPage";

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
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    errorElement: <ErrorBoundary />,
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: HomeDashboard },
      { path: "path-to-pro", Component: PathToPro },
      { path: "events", Component: EventsPage },
      { path: "community", Component: CommunityPage },
      { path: "profile", Component: ProfilePage },
      { path: "my-events", Component: MyEventsPage },
      {
        path: "team",
        element: (
          <ProtectedRoute allowedRoles={["Player", "Coach"]}>
            <TeamDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "coach-terminal",
        element: (
          <ProtectedRoute allowedRoles={["Coach"]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: CoachTerminal },
          { path: "roster", Component: RosterManager },
          { path: "scouting", Component: ScoutingBoard },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
