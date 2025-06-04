"use client";

import Container from "@/components/Container";
import { useSocket } from "@/context/SocketProvider";
import { useGame } from "@/context/GameProvider";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBackgroundGradient from "../TopGradient";
import Image from "next/image";
import { Button } from "../ui/button";
import {  IconClock12, IconLoader2, IconTarget, IconLink, IconEye } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Navbar from "../navbar";

export default function PlayPage() {
  const { socket, connect, status } = useSocket();
  const { joinGame } = useGame();
  const { userData } = useUser();
  const router = useRouter();
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [selectedTimeControl, setSelectedTimeControl] = useState("rapid");


  useEffect(() => {
    if (status === "disconnected") {
      connect();
    }
  }, [status, connect]);

  const handleStartGame = async () => {
    if (!socket?.connected || !userData || isCreatingGame) {
      return;
    }

    setIsCreatingGame(true);

    try {
    
      const handleGameJoined = (data: { roomId: string }) => {
      
        router.push(`/game/${data.roomId}`);
        socket.off("game_joined", handleGameJoined);
      };

      socket.on("game_joined", handleGameJoined);

  
      joinGame(userData.guestId, undefined, userData.playerName);
    } catch (error) {
      console.error("Failed to start game:", error);
      setIsCreatingGame(false);
    }
  };



  return (
    <>
    <Navbar/>
    
    <Container className="max-w-7xl mt-20">
      <TopBackgroundGradient />
      <div className="min-h-screen pt-20">
        <div className="mx-auto grid w-full grid-cols-1 gap-12 px-4 lg:grid-cols-2 lg:items-center">
          {/* Chess Board Section */}
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/board.webp"
                alt="Chess Board"
                width={600}
                height={600}
                className="rounded-2xl shadow-2xl ring-1 ring-border/20"
                priority
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>

          {/* Game Controls Section */}
          <div className="flex flex-col justify-center space-y-8">
           
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Start Playing
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Challenge an opponent and test your chess skills
              </p>
            </div>

            {/* Game Controls */}
            <div className="space-y-6">
              {status === "disconnected" ? (
              
                <div className="space-y-6">
                  <div className="flex justify-center lg:justify-start">
                    <div className="h-12 w-48 animate-pulse rounded-lg bg-muted" />
                  </div>
                  <div className="flex justify-center lg:justify-start">
                    <div className="h-14 w-48 animate-pulse rounded-lg bg-muted" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ) : (
              
                <div className="space-y-6">
                  
                  <div className="flex justify-center lg:justify-start">
                    <Select
                      value={selectedTimeControl}
                      onValueChange={setSelectedTimeControl}
                      defaultValue="rapid"
                    >
                      <SelectTrigger className="w-48 h-12 bg-card border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectGroup>
                         
                          <SelectItem value="rapid" className="cursor-pointer">
                            <div className="flex items-center">
                              <IconClock12 className="mr-3 h-4 w-4 text-primary" />
                              <span className="font-medium">Rapid</span>
                              <span className="ml-2 text-muted-foreground">(10+0)</span>
                            </div>
                          </SelectItem>
                         
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      onClick={handleStartGame}
                      disabled={isCreatingGame || !userData}
                      size="lg"
                      variant={"secondary"}
                      className="w-48 h-14 text-lg font-semibold text-neutral-200  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-neutral-700"
                    >
                      {isCreatingGame ? (
                        <div className="flex items-center space-x-2">
                          <IconLoader2 className="h-5 w-5 animate-spin" />
                          <span>Starting...</span>
                        </div>
                      ) : (
                        "Start Game"
                      )}
                    </Button>
                  </div>
                </div>
              )}

           
              {!userData && status === "connected" && (
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-muted-foreground">
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Setting up player data...</span>
                </div>
              )}
            </div>

           
            <div className="space-y-3 rounded-lg border border-border bg-card/50 p-6">
              <h3 className="font-semibold text-foreground">How to Play</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start space-x-3">
                  <IconTarget className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Click "Start Game" to create a new game room</span>
                </div>
                <div className="flex items-start space-x-3">
                  <IconLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Share the room link with a friend to play together</span>
                </div>
                <div className="flex items-start space-x-3">
                  <IconEye className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Others can spectate your game in real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
    </>
  );
}