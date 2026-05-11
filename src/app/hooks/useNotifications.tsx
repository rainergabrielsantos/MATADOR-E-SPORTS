import { useNotificationContext } from "../context/NotificationContext";

export type { Notification, NotificationType } from "../context/NotificationContext";

export function useNotifications() {
  return useNotificationContext();
}
