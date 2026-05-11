import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export type NotificationType = "ticket" | "message" | "announcement" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (type: NotificationType, title: string, content: string, link?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const CHANNEL_NAME = "matador_notifications_channel";
const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("matador_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("matador_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data.type === "NEW_NOTIFICATION") {
        setNotifications((prev) => [event.data.notification, ...prev]);
        // Trigger toast for synced tabs too
        triggerAlert(event.data.notification);
      }
    };
    return () => channel.close();
  }, []);

  const triggerAlert = (notif: Notification) => {
    // Play Sound
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.volume = 0.4;
    audio.play().catch(() => {}); // Browser might block auto-play

    // Show Toast
    toast(notif.title, {
      description: notif.content,
      action: notif.link ? {
        label: "View",
        onClick: () => window.location.href = notif.link!
      } : undefined,
    });
  };

  const addNotification = (type: NotificationType, title: string, content: string, link?: string) => {
    const newNotif: Notification = {
      id: `n${Date.now()}`,
      type,
      title,
      content,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    setNotifications((prev) => [newNotif, ...prev]);
    triggerAlert(newNotif);
    
    // Sync with other tabs
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: "NEW_NOTIFICATION", notification: newNotif });
    channel.close();
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      markAsRead, 
      markAllAsRead, 
      clearNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
}
