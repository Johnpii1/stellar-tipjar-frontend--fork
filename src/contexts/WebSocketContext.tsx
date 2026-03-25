"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import toast, { Toaster } from "react-hot-toast";

import { useWebSocket } from "@/hooks/useWebSocket";
import { useNotifications, TipNotification } from "@/hooks/useNotifications";
import {
  playNotificationSound,
  isSoundMuted,
  setSoundMuted,
} from "@/utils/soundUtils";

interface TipReceivedPayload {
  amount: string;
  from: string;
  memo?: string;
}

interface WebSocketContextType {
  notifications: TipNotification[];
  unreadCount: number;
  markAllRead: () => void;
  clearNotifications: () => void;
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  connectionStatus: string;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

  const { socketRef, status } = useWebSocket({ url: wsUrl });
  const { notifications, unreadCount, addNotification, markAllRead, clearNotifications } =
    useNotifications();

  // Lazy initializer reads localStorage only on the client (avoids setState-in-effect)
  const [isMuted, setIsMuted] = useState<boolean>(() =>
    typeof window !== "undefined" ? isSoundMuted() : false
  );

  const setMuted = useCallback((muted: boolean) => {
    setSoundMuted(muted);
    setIsMuted(muted);
  }, []);

  // Request browser notification permission on mount
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleTipReceived = (tip: TipReceivedPayload) => {
      const amount = tip.amount ?? "?";
      const shortFrom = tip.from
        ? `${tip.from.slice(0, 4)}…${tip.from.slice(-4)}`
        : "Unknown";

      addNotification({ amount, from: tip.from ?? "", memo: tip.memo });

      // Native OS notification (works even when the tab is in the background)
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("💸 New tip received!", {
          body: tip.memo
            ? `${amount} XLM – "${tip.memo}"`
            : `${amount} XLM from ${shortFrom}`,
          icon: "/favicon.ico",
          tag: "tip-received",
        });
      }

      toast.success(
        tip.memo
          ? `💸 New tip: ${amount} XLM\n"${tip.memo}"`
          : `💸 New tip: ${amount} XLM from ${shortFrom}`,
        {
          duration: 6000,
          style: {
            background: "#1e1b4b",
            color: "#e0e7ff",
            border: "1px solid #4f46e5",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          iconTheme: { primary: "#818cf8", secondary: "#1e1b4b" },
        }
      );

      playNotificationSound();
    };

    socket.on("tip:received", handleTipReceived);
    return () => {
      socket.off("tip:received", handleTipReceived);
    };
  }, [socketRef, addNotification]);

  return (
    <WebSocketContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        clearNotifications,
        isMuted,
        setMuted,
        connectionStatus: status,
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext(): WebSocketContextType {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return ctx;
}
