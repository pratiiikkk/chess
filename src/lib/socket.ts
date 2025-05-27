import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL||"http://localhost:3000";

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const createSocket = (): TypedSocket => {
  return io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  });
};

export { SOCKET_URL };
