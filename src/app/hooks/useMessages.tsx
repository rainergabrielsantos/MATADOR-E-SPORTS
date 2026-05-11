import { useState, useEffect } from "react";
import { useNotifications } from "./useNotifications";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  createdAt: string;
}

export function useMessages() {
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("matador_messages");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("matador_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (senderId: string, senderName: string, recipientId: string, content: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId,
      senderName,
      recipientId,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Notify recipient (scoping is handled by the component, but we trigger the global alert)
    addNotification(
      "message",
      `Message from ${senderName}`,
      content.length > 40 ? content.slice(0, 37) + "..." : content,
      "/dashboard/team"
    );
  };

  const getConversation = (userId1: string, userId2: string) => {
    return messages.filter(
      (m) =>
        (m.senderId === userId1 && m.recipientId === userId2) ||
        (m.senderId === userId2 && m.recipientId === userId1)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  return { messages, sendMessage, getConversation };
}
