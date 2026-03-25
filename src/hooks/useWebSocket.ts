"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export type SocketStatus = "connecting" | "connected" | "disconnected" | "error";

export interface UseWebSocketOptions {
  /** The WebSocket server URL. If falsy, the hook does nothing. */
  url?: string;
}

export interface UseWebSocketReturn {
  /** Stable ref to the active socket. Access via socketRef.current inside effects. */
  socketRef: React.MutableRefObject<Socket | null>;
  status: SocketStatus;
}

export function useWebSocket({ url }: UseWebSocketOptions): UseWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>(
    url ? "connecting" : "disconnected"
  );

  useEffect(() => {
    if (!url) return;

    const newSocket = io(url, {
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 30000,
    });

    // Store in ref – no setState here, so no cascading-render lint violation
    socketRef.current = newSocket;

    newSocket.on("connect", () => setStatus("connected"));
    newSocket.on("disconnect", () => setStatus("disconnected"));
    newSocket.on("connect_error", () => setStatus("error"));
    newSocket.on("reconnect", () => setStatus("connected"));
    newSocket.on("reconnect_attempt", () => setStatus("connecting"));

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setStatus("disconnected");
    };
  }, [url]);

  return { socketRef, status };
}


