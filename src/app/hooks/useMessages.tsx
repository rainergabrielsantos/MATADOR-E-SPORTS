import { useState, useEffect } from "react";
import { useNotifications } from "./useNotifications";
import { db } from "../../lib/firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  or, 
  Timestamp 
} from "firebase/firestore";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  createdAt: string;
}

export function useMessages(currentUserId?: string) {
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "messages"),
      or(
        where("senderId", "==", currentUserId),
        where("recipientId", "==", currentUserId),
        where("recipientId", "==", "TEAM_MATADORS_VARSITY")
      )
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        } as Message;
      });
      
      // Sort by creation time manually since OR queries with orderBy can be tricky with indexes
      fetched.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      setMessages(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const sendMessage = async (senderId: string, senderName: string, recipientId: string, content: string) => {
    try {
      await addDoc(collection(db, "messages"), {
        senderId,
        senderName,
        recipientId,
        content,
        createdAt: Timestamp.now(),
      });

      // We only trigger local notification here if we are the sender, but actually 
      // the recipient will get notified via a cloud function or listener. 
      // For now, keep local trigger for demo if needed, but it's redundant for the sender.
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getConversation = (userId1: string, userId2: string) => {
    return messages.filter(
      (m) =>
        (m.senderId === userId1 && m.recipientId === userId2) ||
        (m.senderId === userId2 && m.recipientId === userId1)
    );
  };

  return { messages, sendMessage, getConversation, loading };
}

