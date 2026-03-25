"use client";

import { useState, useCallback } from "react";

export interface TipNotification {
  id: string;
  amount: string;
  from: string;
  memo?: string;
  timestamp: number;
  read: boolean;
}

export interface UseNotificationsReturn {
  notifications: TipNotification[];
  unreadCount: number;
  addNotification: (tip: Omit<TipNotification, "id" | "timestamp" | "read">) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<TipNotification[]>([]);

  const addNotification = useCallback(
    (tip: Omit<TipNotification, "id" | "timestamp" | "read">) => {
      const notification: TipNotification = {
        ...tip,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
    },
    []
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, addNotification, markAllRead, clearNotifications };
}
