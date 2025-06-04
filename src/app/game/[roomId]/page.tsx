"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/context/SocketProvider";
import { useGame } from "@/context/GameProvider";
import { useUser } from "@/hooks/useUser";
import Container from "@/components/Container";
import GameInterface from "@/components/chess/GameInterface";
import TopBackgroundGradient from "@/components/TopGradient";

export default function GamePage() {
  const { roomId } = useParams<{
    roomId: string;
  }>();

  const { socket, connect, status } = useSocket();
  const { game, joinGame } = useGame();
  const { userData } = useUser();
  const [hasJoined, setHasJoined] = useState(false);

  // Connect to socket when component mounts
  useEffect(() => {
    if (status === "disconnected") {
      connect();
    }
  }, [status, connect]);

  // Join game when socket connects and user data is available
  useEffect(() => {
    if (socket?.connected && userData && roomId && !hasJoined && !game) {
      console.log("Joining game with:", {
        guestId: userData.guestId,
        roomId: roomId,
        playerName: userData.playerName,
      });

      joinGame(userData.guestId, roomId, userData.playerName);
      setHasJoined(true);
    }
  }, [socket?.connected, userData, hasJoined, game, joinGame, roomId]);

  // Reset hasJoined when roomId changes
  useEffect(() => {
    setHasJoined(false);
  }, [roomId]);

  if (!roomId) {
    return (
      <Container className="max-w-[100vw] text-white">
        <div className="mt-20 flex h-[calc(100vh-7rem)] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-white">Invalid Game</h1>
            <p className="text-gray-400">No room ID provided</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container className="max-w-[100vw] text-white">
        <TopBackgroundGradient />

        <div className="mt-24 h-[calc(100vh-8rem)]">
          <GameInterface />
        </div>
      </Container>
    </>
  );
}
