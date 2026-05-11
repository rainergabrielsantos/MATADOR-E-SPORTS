import { useState, useEffect } from "react";

export type TicketStatus = "Pending" | "Assigned" | "In-Progress" | "Completed";

export interface CoachingTicket {
  id: string;
  player_id: string;
  playerName: string;
  coach_id?: string;
  coachName?: string;
  vodLink: string;
  goals: string;
  status: TicketStatus;
  annotatedVodUrl?: string;
  createdAt: string;
}

// Mock initial data
const initialTickets: CoachingTicket[] = [
  {
    id: "t1",
    player_id: "p1",
    playerName: "Matador_Pro",
    vodLink: "https://www.youtube.com/watch?v=example1",
    goals: "Improve my utility usage in site takes.",
    status: "Pending",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "t2",
    player_id: "p2",
    playerName: "NoobMaster69",
    vodLink: "https://www.youtube.com/watch?v=example2",
    goals: "Better crosshair placement.",
    status: "In-Progress",
    coach_id: "c1",
    coachName: "Coach K",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

export function useTickets() {
  const { addNotification } = useNotifications();
  const [tickets, setTickets] = useState<CoachingTicket[]>(() => {
    const saved = localStorage.getItem("coaching_tickets");
    return saved ? JSON.parse(saved) : initialTickets;
  });

  useEffect(() => {
    localStorage.setItem("coaching_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const createTicket = (ticket: Omit<CoachingTicket, "id" | "status" | "createdAt">) => {
    const newTicket: CoachingTicket = {
      ...ticket,
      id: `t${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
    
    addNotification(
      "ticket",
      "New Coaching Request",
      `${newTicket.playerName} submitted a new VOD for review.`,
      "/dashboard/coach-terminal"
    );
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus, annotatedVodUrl?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = { ...t, status, annotatedVodUrl: annotatedVodUrl || t.annotatedVodUrl };

          if (status === "Completed") {
            addNotification(
              "ticket",
              "Coaching Review Ready",
              "Your VOD has been reviewed! Click to view feedback.",
              "/dashboard/player-terminal"
            );
          } else if (status === "In-Progress") {
            addNotification(
              "system",
              "Review Started",
              `A coach has started analyzing your VOD.`
            );
          }
          return updated;
        }
        return t;
      })
    );
  };

  const assignCoach = (ticketId: string, coachId: string, coachName: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, coach_id: coachId, coachName, status: "Assigned" } : t
      )
    );
  };

  return { tickets, createTicket, updateTicketStatus, assignCoach };
}
