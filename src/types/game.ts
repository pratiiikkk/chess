import { Move } from "chess.js";

export enum GameStatus {
  WAITING = "waiting",
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  ABANDONED = "abandoned",
}

export enum GameResult {
  WHITE_WINS = "white_wins",
  BLACK_WINS = "black_wins",
  DRAW = "draw",
  ONGOING = "ongoing",
}

export enum GameEndReason {
  CHECKMATE = "checkmate",
  RESIGNATION = "resignation",
  TIMEOUT = "timeout",
  STALEMATE = "stalemate",
  INSUFFICIENT_MATERIAL = "insufficient_material",
  THREEFOLD_REPETITION = "threefold_repetition",
  FIFTY_MOVE_RULE = "fifty_move_rule",
  DRAW_BY_AGREEMENT = "draw_by_agreement",
  ABANDONMENT = "abandonment",
}

export enum PlayerRole {
  WHITE = "w",
  BLACK = "b",
  SPECTATOR = "s",
}

export type GameTimers = {
  whiteTime: number;
  blackTime: number;
  increment: number;
  lastMoveTime?: number;
  serverTimestamp?: number; // server time when timer was last updated
  isPaused?: boolean; // whether timer is paused
  pausedAt?: number; // timestamp when paused
};

export type GameMetadata = {
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  totalMoves: number;
};

export type Player = {
  guestId: string;
  name: string;
  color: PlayerRole;
  isConnected: boolean;
};

export type Game = {
  roomId: string;
  status: GameStatus;
  result: GameResult;
  endReason?: GameEndReason;
  players: Player[];
  spectatorCount: number;
  turn: "w" | "b";
  fen: string;
  moves: Move[];
  timers?: GameTimers;
  metadata: GameMetadata;
  drawOffer?: {
    offeredBy: PlayerRole;
    timestamp: Date;
  };
};
