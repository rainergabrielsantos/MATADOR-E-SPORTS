import { useState, useEffect } from "react";
import { useNotifications } from "./useNotifications";
import { db } from "../../lib/firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";

export type TicketStatus = "Pending" | "Assigned" | "In-Progress" | "Completed";

export interface CoachingTicket {
  id: string;
  player_id: string;
  playerName: string;
  coach_id?: string;
  coachName?: string;
  vodLink?: string;
  game: string;
  helpType: string;
  goals: string;
  status: TicketStatus;
  annotatedVodUrl?: string;
  feedback?: string;
  notes?: string;
  metrics?: Record<string, number>;
  createdAt: string;
}

export function useTickets() {
  const { addNotification } = useNotifications();
  const [tickets, setTickets] = useState<CoachingTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTickets = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          // Convert Firestore Timestamp to ISO string if needed
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        } as CoachingTicket;
      });
      setTickets(fetchedTickets);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createTicket = async (ticket: Omit<CoachingTicket, "id" | "status" | "createdAt">) => {
    try {
      const newTicket = {
        ...ticket,
        status: "Pending" as TicketStatus,
        createdAt: Timestamp.now(),
      };
      
      await addDoc(collection(db, "tickets"), newTicket);
      
      addNotification(
        "ticket",
        "New Coaching Request",
        `${ticket.playerName} submitted a new VOD for review.`,
        "/dashboard/coach-terminal"
      );
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const updateTicketStatus = async (
    ticketId: string, 
    status: TicketStatus, 
    annotatedVodUrl?: string, 
    feedback?: string,
    notes?: string,
    metrics?: Record<string, number>
  ) => {
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      const updateData: any = { status };
      if (annotatedVodUrl) updateData.annotatedVodUrl = annotatedVodUrl;
      if (feedback) updateData.feedback = feedback;
      if (notes) updateData.notes = notes;
      if (metrics) updateData.metrics = metrics;

      await updateDoc(ticketRef, updateData);

      if (status === "Completed") {
        addNotification(
          "ticket",
          "Coaching Review Ready",
          "Your request has been reviewed! Click to view feedback.",
          "/dashboard/path-to-pro"
        );
      } else if (status === "In-Progress") {
        addNotification(
          "system",
          "Review Started",
          `A coach has started analyzing your request.`
        );
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const assignCoach = async (ticketId: string, coachId: string, coachName: string) => {
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      await updateDoc(ticketRef, {
        coach_id: coachId,
        coachName: coachName,
        status: "Assigned" as TicketStatus
      });
    } catch (error) {
      console.error("Error assigning coach:", error);
    }
  };

  return { tickets, createTicket, updateTicketStatus, assignCoach, loading };
}

