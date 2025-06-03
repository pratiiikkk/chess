import { Move } from "chess.js";
import { Game, GameResult, GameEndReason, PlayerRole } from "./game";

// Socket event types
export interface ServerToClientEvents {
  game_joined: (data: {
    roomId: string;
    game: Game;
    playerColor?: PlayerRole;
    isSpectator?: boolean;
    reconnected?: boolean;
  }) => void;

  game_updated: (game: Game) => void;
  game_started: () => void;
  game_resumed: () => void;
  game_ended: (data: {
    result: GameResult;
    reason: GameEndReason;
    game: Game;
  }) => void;

  move_made: (data: { move: Move; game: Game }) => void;
  move_error: (data: { error: string }) => void;

  timer_sync: (data: {
    whiteTime: number;
    blackTime: number;
    turn: "w" | "b";
    serverTimestamp: number;
    isPaused: boolean;
  }) => void;

  player_disconnected: (data: { playerId: string; playerName: string }) => void;
  player_reconnected: (data: { playerId: string; playerName: string }) => void;

  spectator_joined: (data: { spectatorName: string }) => void;
  spectator_left: () => void;

  draw_offered: (data: { game: Game }) => void;
  error_message: (data: { error: string }) => void;
}

export interface ClientToServerEvents {
  join: (data: {
    guestId: string;
    roomId?: string;
    playerName?: string;
  }) => void;

  move: (data: { roomId: string; move: any }) => void;
  offer_draw: (data: { roomId: string }) => void;
  accept_draw: (data: { roomId: string }) => void;
  resign: (data: { roomId: string }) => void;
  request_timer_sync: (data: { roomId: string }) => void;
}

// Socket connection states
export enum SocketStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}
