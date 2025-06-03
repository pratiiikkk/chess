"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Game, GameResult, GameEndReason, PlayerRole } from "@/types/game";
import {
  IconTrophy,
  IconHandClick,
  IconClock,
  IconFlag,
  IconRotateClockwise,
  IconHome,
  IconCopy,
  IconSmartHome,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface GameOverDialogProps {
  game: Game;
  playerColor: PlayerRole | null;
  isSpectator: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GameOverDialog({
  game,
  playerColor,
  isSpectator,
  open,
  onOpenChange,
}: GameOverDialogProps) {
  const router = useRouter();

 

  const getResultTitle = () => {
    if (isSpectator) {
      switch (game.result) {
        case GameResult.WHITE_WINS:
          return "White Wins!";
        case GameResult.BLACK_WINS:
          return "Black Wins!";
        case GameResult.DRAW:
          return "It's a Draw!";
        default:
          return "Game Over";
      }
    }

 
    switch (game.result) {
      case GameResult.WHITE_WINS:
        return playerColor === PlayerRole.WHITE ? "You Won!" : "You Lost";
      case GameResult.BLACK_WINS:
        return playerColor === PlayerRole.BLACK ? "You Won!" : "You Lost";
      case GameResult.DRAW:
        return "It's a Draw!";
      default:
        return "Game Over";
    }
  };

  const getResultDescription = () => {
    const winnerName =
      game.result === GameResult.WHITE_WINS
        ? game.players.find((p) => p.color === PlayerRole.WHITE)?.name ||
          "White"
        : game.result === GameResult.BLACK_WINS
          ? game.players.find((p) => p.color === PlayerRole.BLACK)?.name ||
            "Black"
          : null;

    const endReasonText = getEndReasonText();

    if (game.result === GameResult.DRAW) {
      return `The game ended in a draw${endReasonText ? ` by ${endReasonText.toLowerCase()}` : ""}.`;
    }

    if (winnerName) {
      return `${winnerName} wins${endReasonText ? ` by ${endReasonText.toLowerCase()}` : ""}!`;
    }

    return endReasonText || "The game has ended.";
  };

  const getEndReasonText = () => {
    switch (game.endReason) {
      case GameEndReason.CHECKMATE:
        return "Checkmate";
      case GameEndReason.RESIGNATION:
        return "Resignation";
      case GameEndReason.TIMEOUT:
        return "Time out";
      case GameEndReason.STALEMATE:
        return "Stalemate";
      case GameEndReason.INSUFFICIENT_MATERIAL:
        return "Insufficient material";
      case GameEndReason.THREEFOLD_REPETITION:
        return "Threefold repetition";
      case GameEndReason.FIFTY_MOVE_RULE:
        return "Fifty-move rule";
      case GameEndReason.DRAW_BY_AGREEMENT:
        return "Mutual agreement";
      case GameEndReason.ABANDONMENT:
        return "Abandonment";
      default:
        return null;
    }
  };

  const getEndReasonIcon = () => {
    switch (game.endReason) {
      case GameEndReason.CHECKMATE:
        return <IconTrophy className="h-4 w-4" />;
      case GameEndReason.RESIGNATION:
        return <IconFlag className="h-4 w-4" />;
      case GameEndReason.TIMEOUT:
        return <IconClock className="h-4 w-4" />;
      case GameEndReason.STALEMATE:
      case GameEndReason.INSUFFICIENT_MATERIAL:
      case GameEndReason.THREEFOLD_REPETITION:
      case GameEndReason.FIFTY_MOVE_RULE:
      case GameEndReason.DRAW_BY_AGREEMENT:
        return <IconHandClick className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handlePlayAgain = () => {
    router.push("/play");
  };

  const handleGoHome = () => {
    router.push("/");
  };



  const handleCopyGameLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    
      toast.message("Game link copied to clipboard!", {
        icon: <IconCopy className="h-4 w-4" />,
        duration: 2000,
      
       
      });
    } catch (err) {
      console.error("Failed to copy game link:", err);
    }
  };

  const getGameStats = () => {
    const totalMoves = game.metadata.totalMoves;
    const duration =
      game.metadata.endedAt && game.metadata.startedAt
        ? new Date(game.metadata.endedAt).getTime() -
          new Date(game.metadata.startedAt).getTime()
        : null;

    const formatDuration = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return {
      moves: totalMoves,
      duration: duration ? formatDuration(duration) : null,
    };
  };

  const stats = getGameStats();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
        
          <DialogTitle className="text-2xl font-bold">
            {getResultTitle()}
          </DialogTitle>
          <DialogDescription className="mt-2 text-base">
            {getResultDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
        
          <div className="bg-neutral-900 space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Result</span>
              <div className="flex items-center gap-2">
                {getEndReasonIcon()}
                <Badge variant="secondary">
                  {getEndReasonText() || "Game Complete"}
                </Badge>
              </div>
            </div>

            {stats.moves > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Total Moves
                </span>
                <span className="font-medium">{stats.moves}</span>
              </div>
            )}

            {stats.duration && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Duration</span>
                <span className="font-medium">{stats.duration}</span>
              </div>
            )}
          </div>

          {/* Players */}
          <div className="bg-neutral-900 space-y-2 rounded-lg border p-4">
            <h4 className="text-muted-foreground mb-3 text-sm font-medium">
              Players
            </h4>
            {game.players.map((player) => (
              <div
                key={player.guestId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      player.color === PlayerRole.WHITE
                        ? "border border-gray-300 bg-neutral-100"
                        : "bg-neutral-950"
                    }`}
                  />
                  <span className="font-medium">{player.name}</span>
                </div>
                {((game.result === GameResult.WHITE_WINS &&
                  player.color === PlayerRole.WHITE) ||
                  (game.result === GameResult.BLACK_WINS &&
                    player.color === PlayerRole.BLACK)) && (
                  <IconTrophy className="h-4 w-4 text-green-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-col sm:space-y-2 sm:space-x-0">
          <div className="flex w-full gap-2">
            <Button onClick={handlePlayAgain}  variant={"secondary"} className="flex-1" size="sm">
              <IconRotateClockwise className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <Button
              onClick={handleGoHome}
              variant="default"
              className="flex-1"
              size="sm"
            >
              <IconSmartHome className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
          <Button
            onClick={handleCopyGameLink}
            variant="ghost"
            className="w-full"
            size="sm"
          >
            <IconCopy className="mr-2 h-4 w-4" />
            Copy Game Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
