import { useState, useEffect } from "react";

export interface CSUNEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  game: string;
  attendeesCount: number;
  image?: string;
}

const initialEvents: CSUNEvent[] = [
  {
    id: "e1",
    title: "Spring LAN Party",
    description: "Join us for a massive multi-game LAN party at the USU. Food and drinks provided!",
    date: "2026-04-15",
    time: "6:00 PM – 11:00 PM",
    location: "University Student Union",
    game: "Multi-Game",
    attendeesCount: 87,
    image: "https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGRlc2slMjBuZW9ufGVufDF8fHx8MTc3NTcxNzExNXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "e2",
    title: "Valorant Varsity Tryouts",
    description: "The official tryouts for the CSUN Valorant Varsity team. Be prepared for a long session.",
    date: "2026-05-20",
    time: "2:00 PM – 6:00 PM",
    location: "Online / Discord",
    game: "Valorant",
    attendeesCount: 32,
    image: "https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwc3R1ZGVudHMlMjB0ZWFtfGVufDF8fHx8MTc3NTcxNzExNnww&ixlib=rb-4.1.0&q=80&w=1080",
  }
];

export function useEvents() {
  const [events, setEvents] = useState<CSUNEvent[]>(() => {
    const saved = localStorage.getItem("matador_events");
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [rsvps, setRsvps] = useState<string[]>(() => {
    const saved = localStorage.getItem("matador_rsvps");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("matador_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("matador_rsvps", JSON.stringify(rsvps));
  }, [rsvps]);

  const toggleRSVP = (eventId: string) => {
    setRsvps((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  return { events, rsvps, toggleRSVP };
}
