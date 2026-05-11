import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
      }
    };
    return () => channel.close();
  }, []);

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
