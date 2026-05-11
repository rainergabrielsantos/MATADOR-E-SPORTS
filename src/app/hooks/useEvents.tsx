import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  where,
  addDoc,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";

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

export function useEvents(currentUserId?: string) {
  const [events, setEvents] = useState<CSUNEvent[]>([]);
  const [rsvps, setRsvps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      const fetched = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as CSUNEvent[];
      setEvents(fetched);
      setLoading(false);
    });

    return () => unsubEvents();
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setRsvps([]);
      return;
    }

    const qRsvps = query(
      collection(db, "event_rsvps"),
      where("userId", "==", currentUserId)
    );

    const unsubRsvps = onSnapshot(qRsvps, (snapshot) => {
      const fetched = snapshot.docs.map(docSnap => docSnap.data().eventId);
      setRsvps(fetched);
    });

    return () => unsubRsvps();
  }, [currentUserId]);

  const toggleRSVP = async (eventId: string) => {
    if (!currentUserId) return;

    try {
      const q = query(
        collection(db, "event_rsvps"),
        where("userId", "==", currentUserId),
        where("eventId", "==", eventId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Add RSVP
        await addDoc(collection(db, "event_rsvps"), {
          userId: currentUserId,
          eventId: eventId
        });
      } else {
        // Remove RSVP
        snapshot.docs.forEach(async (docSnap) => {
          await deleteDoc(doc(db, "event_rsvps", docSnap.id));
        });
      }
    } catch (error) {
      console.error("Error toggling RSVP:", error);
    }
  };

  return { events, rsvps, toggleRSVP, loading };
}

