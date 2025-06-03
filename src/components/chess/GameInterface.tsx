import React, { useState, useEffect } from "react";
import { useGame } from "@/context/GameProvider";
import { GameStatus, PlayerRole } from "@/types/game";
import Board from "../Board";
import Timer from "./Timer";
import MoveHistory from "./MoveHistory";
import GameOverDialog from "./GameOverDialog";
import {
  IconFlag,
  IconHandStop,
  IconUsers,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useSounds, SoundType } from "@/hooks/useSounds";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function GameInterface({ className }: { className?: string }) {
  const {
    game,
    playerColor,
    isSpectator,
    isConnected,
    error,
    offerDraw,
    acceptDraw,
    resign,
    clearError,
  } = useGame();

  const router = useRouter();

  const { playSound, isEnabled: soundsEnabled, toggleSounds } = useSounds();

  // State for game over dialog
  const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isViewingHistory, setIsViewingHistory] = useState(false);


  useEffect(() => {
    if (game?.moves) {
      const latestMoveIndex = game.moves.length - 1;
      if (!isViewingHistory) {
        setCurrentMoveIndex(latestMoveIndex);
      }
    }
  }, [game?.moves, isViewingHistory]);

  // Show game over dialog when  game is completed
  useEffect(() => {
    if (game && game.status === GameStatus.COMPLETED) {
      console.log("Game completed, showing dialog");
      const timer = setTimeout(() => {
        setGameOverDialogOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [game?.status]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        onDismiss() {
          clearError();
        },
        onAutoClose() {
          clearError();
        },
      });
      if (error.includes("Game not found")) {
        setTimeout(() => {
          router.push("/play");
        }, 2000);
      }
    }
  }, [error]);
  const handleNavigateToMove = (moveIndex: number) => {
    if (!game) return;
    
    const maxMoveIndex = game.moves.length - 1;
    const clampedIndex = Math.max(-1, Math.min(maxMoveIndex, moveIndex));
    
    setCurrentMoveIndex(clampedIndex);
    setIsViewingHistory(clampedIndex !== maxMoveIndex);
    
    // Play navigation sound
    playSound(SoundType.BUTTON_CLICK);
  };

  // Reset to current position when new move is made
  useEffect(() => {
    if (game?.moves && isViewingHistory) {
      const latestMoveIndex = game.moves.length - 1;
      if (currentMoveIndex === latestMoveIndex) {
        setIsViewingHistory(false);
      }
    }
  }, [game?.moves, currentMoveIndex, isViewingHistory]);


  if (!isConnected) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center",
          className,
        )}
      >
        <div className="text-center">
          <div className="mb-4 text-2xl">🔌</div>
          <div className="text-lg font-semibold text-white">
            Connecting to server...
          </div>
          <div className="text-sm text-gray-400">
            Please wait while we establish connection
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className={`flex h-full w-full items-center justify-center`}>
        <div className="space-y-4 text-center">
          <div className="mb-4 text-4xl">♟️</div>
          <div className="text-lg font-semibold text-white">
            Setting up your game...
          </div>
          <div className="space-y-1 text-sm text-gray-400">
            <p>Creating game room and waiting for connection</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              <span>Please wait</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getPlayerByColor = (color: PlayerRole) => {
    return game.players.find((p) => p.color === color);
  };

  const whitePlayer = getPlayerByColor(PlayerRole.WHITE);
  const blackPlayer = getPlayerByColor(PlayerRole.BLACK);

  const getGameStatusText = () => {
    switch (game.status) {
      case GameStatus.WAITING:
        return "Waiting for players...";
      case GameStatus.ACTIVE:
        const currentPlayer = game.turn === "w" ? whitePlayer : blackPlayer;
        if (isSpectator) {
          return `${currentPlayer?.name || "Player"} to move`;
        }
        return game.turn === playerColor ? "Your turn" : "Opponent's turn";
      case GameStatus.PAUSED:
        return "Game paused";
      case GameStatus.COMPLETED:
        return `Game over - ${game.result}`;
      default:
        return "";
    }
  };

  const canMakeGameActions = () => {
    return (
      !isSpectator &&
      game.status === GameStatus.ACTIVE &&
      game.players.length === 2
    );
  };

  const handleResign = () => {
    playSound(SoundType.BUTTON_CLICK);
    resign();
  };

  const handleOfferDraw = () => {
    playSound(SoundType.DRAW_OFFER);
    offerDraw();
  };

  const handleAcceptDraw = () => {
    playSound(SoundType.BUTTON_CLICK);
    acceptDraw();
  };

  return (
    <div className={`h-full w-full ${className} `}>
      {/* Error Toast */}

      <div className="mx-auto grid h-full max-w-[1400px] grid-cols-1 gap-3 lg:grid-cols-[1fr_400px]">
        {/* Center - Board with Player Details */}
        <div className="order-1 flex h-fit flex-col items-center justify-center lg:order-2">
          <div
            className={cn(
              "w-full max-w-[45rem] rounded-lg p-4",
              playerColor === PlayerRole.BLACK ? "order-3" : "order-1",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 font-bold text-white">
                  {blackPlayer?.name?.charAt(0).toUpperCase() || "B"}
                  {!blackPlayer?.isConnected && (
                    <div className="absolute inset-0 h-10 w-10 animate-spin rounded-full border-b-2 border-white"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {blackPlayer?.name || "Waiting..."}
                    </span>
                    {blackPlayer?.isConnected && (
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">Black</div>
                </div>
              </div>
              {game.timers && (
                <Timer
                  timeMs={game.timers.blackTime}
                  isActive={
                    game.status === GameStatus.ACTIVE && game.turn === "b"
                  }
                  playerName={blackPlayer?.name || "Black"}
                  className=""
                />
              )}
            </div>
          </div>

          {/* Chess Board */}
          <div className="order-2 h-full w-full">
            <Board  currentMoveIndex={currentMoveIndex} />
          </div>

          <div
            className={cn(
              "w-full max-w-[45rem] rounded-lg p-4",
              playerColor === PlayerRole.WHITE ? "order-3" : "order-1",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-bold text-white">
                  {whitePlayer?.name?.charAt(0).toUpperCase() || "W"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {whitePlayer?.name || "Waiting..."}
                    </span>
                    {whitePlayer?.isConnected && (
                      <div className="h-2 w-2 rounded-full bg-green-300"></div>
                    )}
                  </div>
                  <div className="text-xs text-green-100">White</div>
                </div>
              </div>
              {game.timers && (
                <Timer
                  timeMs={game.timers.whiteTime}
                  isActive={
                    game.status === GameStatus.ACTIVE && game.turn === "w"
                  }
                  playerName={whitePlayer?.name || "White"}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Move History */}
        <div className="order-2 mx-auto mb-10 flex h-fit w-full flex-col sm:w-[500px] md:w-[350px] lg:order-3">
          <div className="order-3 flex h-fit w-full flex-col items-end space-y-4 lg:order-1">
            <div className="mx-auto mb-10 flex w-full flex-col gap-4 sm:w-[500px] md:w-[350px] md:justify-end">
              {/* Game Info */}
              <div className="bg-card rounded-lg p-4">
                <div className="text-center">
                  <div className="mb-1 text-sm text-gray-300">
                    {game.timers
                      ? `${game.timers.whiteTime / 60000}+${game.timers.increment / 1000}`
                      : "Unlimited"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {isSpectator ? "Spectating" : "Playing"}
                  </div>
                  {game.spectatorCount > 0 && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                      <IconUsers className="h-3 w-3" />
                      {game.spectatorCount} spectator
                      {game.spectatorCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Sound Controls */}
              <div className="bg-card rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Sound Effects</span>
                  <button
                    onClick={toggleSounds}
                    className="hover:bg-background rounded-lg p-2 transition-colors"
                  >
                    {soundsEnabled ? (
                      <IconVolume className="h-4 w-4 text-green-400" />
                    ) : (
                      <IconVolumeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Game Controls */}
              {canMakeGameActions() && (
                <div className="flex gap-2">
                  <button
                    onClick={handleResign}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-neutral-800 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                  >
                    <IconFlag className="h-4 w-4" />
                    Resign
                  </button>
                  <button
                    onClick={handleOfferDraw}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-neutral-800 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                  >
                    <IconHandStop className="h-4 w-4" />
                    Draw
                  </button>
                </div>
              )}

              {/* Draw Offer */}
              {game.drawOffer && !isSpectator && (
                <div className="bg-card rounded-lg p-3">
                  <div className="text-center text-sm text-white">
                    {game.drawOffer.offeredBy === playerColor
                      ? "Draw offer sent"
                      : "Draw offered by opponent"}
                  </div>
                  {game.drawOffer.offeredBy !== playerColor && (
                    <Button
                      onClick={handleAcceptDraw}
                      variant={"secondary"}
                      className="mt-5 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                    >
                      Accept Draw
                    </Button>
                  )}
                </div>
              )}

              {/* Connection Status */}
              <div className="rounded-lg bg-[#1e1d1d] p-3">
                <div className="text-center">
                  <div className="mb-1 text-xs text-gray-400">Connection</div>
                  <div
                    className={`text-sm font-medium ${isConnected ? "text-green-400" : "text-red-400"}`}
                  >
                    {isConnected ? "● Online" : "● Offline"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MoveHistory
            moves={game.moves}
            currentMoveIndex={currentMoveIndex}
            onNavigateToMove={handleNavigateToMove}
          />

          {/* Game Status */}
          <div className="bg-card mt-4 rounded-lg p-3">
            <div className="text-center">
              <div className="mb-1 text-sm font-semibold text-[#769656]">
                {getGameStatusText()}
              </div>
              <div className="text-xs text-gray-400">
                Move {game.metadata.totalMoves}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Dialog */}
      {game && (
        <GameOverDialog
          game={game}
          playerColor={playerColor}
          isSpectator={isSpectator}
          open={gameOverDialogOpen}
          onOpenChange={setGameOverDialogOpen}
        />
      )}
    </div>
  );
}
