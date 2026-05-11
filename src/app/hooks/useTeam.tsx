import { useState, useEffect } from "react";
import { useNotifications } from "./useNotifications";
import { db } from "../../lib/firebase";
import { collection, addDoc, onSnapshot, query, where, orderBy, Timestamp } from "firebase/firestore";

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
  const [roster, setRoster] = useState<TeamMember[]>([]);
  const [announcements, setAnnouncements] = useState<TeamAnnouncement[]>([]);
  const [matches] = useState<TeamMatch[]>(initialMatches);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Roster
    const qRoster = query(
      collection(db, "users"),
      where("role", "in", ["Player", "Coach"])
    );

    const unsubRoster = onSnapshot(qRoster, (snapshot) => {
      const fetchedRoster = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.username,
          role: data.role === "Player" ? "Varsity Player" : "Staff / Coach",
          avatar: data.avatar,
          status: "online" // Demo
        } as TeamMember;
      });
      setRoster(fetchedRoster);
    });

    // Fetch Announcements
    const qAnnouncements = query(
      collection(db, "team_announcements"),
      orderBy("createdAt", "desc")
    );

    const unsubAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      const fetchedAnnouncements = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        } as TeamAnnouncement;
      });
      setAnnouncements(fetchedAnnouncements);
      setLoading(false);
    });

    return () => {
      unsubRoster();
      unsubAnnouncements();
    };
  }, []);

  const addAnnouncement = async (title: string, content: string, author: string) => {
    try {
      await addDoc(collection(db, "team_announcements"), {
        title,
        content,
        author,
        createdAt: Timestamp.now()
      });

      addNotification(
        "announcement",
        `New Announcement: ${title}`,
        content.length > 40 ? content.slice(0, 37) + "..." : content,
        "/dashboard/team"
      );
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  return { roster, announcements, matches, addAnnouncement, loading };
}
