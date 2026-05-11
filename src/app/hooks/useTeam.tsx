import { useState, useEffect } from "react";
import { useNotifications } from "./useNotifications";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "online" | "offline";
}

export interface TeamAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface TeamMatch {
  id: string;
  opponent: string;
  date: string;
  time: string;
  type: "Tournament" | "Scrim" | "League";
  result?: string;
}

const initialRoster: TeamMember[] = [
  { id: "u1", name: "RedMatador", role: "IGL / Entry", status: "online" },
  { id: "u2", name: "AceMatador", role: "AWPer", status: "online" },
  { id: "u3", name: "Shadow", role: "Support", status: "offline" },
  { id: "u4", name: "FlexKing", role: "Lurker", status: "online" },
  { id: "u5", name: "CoachX", role: "Coach / Analyst", status: "offline" },
];

const initialAnnouncements: TeamAnnouncement[] = [
  {
    id: "a1",
    title: "Scrim Block Tonight",
    content: "We have a scrim against UCLA at 8 PM. Please be in Discord 15 minutes early.",
    author: "CoachX",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Jersey Sizing",
    content: "Please fill out the jersey sizing form in the team Discord by Friday.",
    author: "RedMatador",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const initialMatches: TeamMatch[] = [
  {
    id: "m1",
    opponent: "UCLA Esports",
    date: "2026-05-15",
    time: "8:00 PM",
    type: "Scrim",
  },
  {
    id: "m2",
    opponent: "USC Trojans",
    date: "2026-05-22",
    time: "6:00 PM",
    type: "Tournament",
  },
];

export function useTeam() {
  const { addNotification } = useNotifications();
  const [roster] = useState<TeamMember[]>(initialRoster);
  const [announcements, setAnnouncements] = useState<TeamAnnouncement[]>(() => {
    const saved = localStorage.getItem("matador_team_announcements");
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });
  const [matches] = useState<TeamMatch[]>(initialMatches);

  useEffect(() => {
    localStorage.setItem("matador_team_announcements", JSON.stringify(announcements));
  }, [announcements]);

  const addAnnouncement = (title: string, content: string, author: string) => {
    const newAnnouncement: TeamAnnouncement = {
      id: `a${Date.now()}`,
      title,
      content,
      author,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);

    addNotification(
      "announcement",
      `New Announcement: ${title}`,
      content.length > 40 ? content.slice(0, 37) + "..." : content,
      "/dashboard/team"
    );
  };

  return { roster, announcements, matches, addAnnouncement };
}
