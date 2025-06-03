"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createSocket, TypedSocket,  } from "@/lib/socket";
import { SocketStatus } from "@/types/socket";

interface SocketContextType {
  socket: TypedSocket | null;
  status: SocketStatus;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<TypedSocket | null>(null);
  const [status, setStatus] = useState<SocketStatus>(SocketStatus.DISCONNECTED);

  const connect = () => {
    if (!socket) {
      const newSocket = createSocket();
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected");
        setStatus(SocketStatus.CONNECTED);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setStatus(SocketStatus.DISCONNECTED);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setStatus(SocketStatus.ERROR);
      });

      setStatus(SocketStatus.CONNECTING);
      newSocket.connect();
    } else if (!socket.connected) {
      setStatus(SocketStatus.CONNECTING);
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setStatus(SocketStatus.DISCONNECTED);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value: SocketContextType = {
    socket,
    status,
    connect,
    disconnect,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
