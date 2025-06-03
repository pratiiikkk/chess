"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { Game, PlayerRole } from "@/types/game";
import { useSocket } from "./SocketProvider";

interface GameState {
  game: Game | null;
  playerColor: PlayerRole | null;
  isSpectator: boolean;
  isConnected: boolean;
  error: string | null;
  chess: Chess | null;
}

type GameAction =
  | {
      type: "SET_GAME";
      payload: { game: Game; playerColor?: PlayerRole; isSpectator?: boolean };
    }
  | { type: "UPDATE_GAME"; payload: Game }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "RESET_GAME" };

const initialState: GameState = {
  game: null,
  playerColor: null,
  isSpectator: false,
  isConnected: false,
  error: null,
  chess: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SET_GAME":
      const chess = new Chess(action.payload.game.fen);
      return {
        ...state,
        game: action.payload.game,
        playerColor: action.payload.playerColor || null,
        isSpectator: action.payload.isSpectator || false,
        chess,
        error: null,
      };

    case "UPDATE_GAME":
      const updatedChess = new Chess(action.payload.fen);
      return {
        ...state,
        game: action.payload,
        chess: updatedChess,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_CONNECTED":
      return {
        ...state,
        isConnected: action.payload,
      };

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
};

interface GameContextType extends GameState {
  joinGame: (guestId: string, roomId?: string, playerName?: string) => void;
  makeMove: (move: Move) => void;
  offerDraw: () => void;
  acceptDraw: () => void;
  resign: () => void;
  clearError: () => void;
  requestTimerSync: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
  roomId?: string;
}

export const GameProvider: React.FC<GameProviderProps> = ({
  children,
  roomId,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { socket, status } = useSocket();

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleGameJoined = (data: {
      roomId: string;
      game: Game;
      playerColor?: PlayerRole;
      isSpectator?: boolean;
      reconnected?: boolean;
    }) => {
      dispatch({
        type: "SET_GAME",
        payload: {
          game: data.game,
          playerColor: data.playerColor,
          isSpectator: data.isSpectator,
        },
      });
    };

    const handleGameUpdated = (game: Game) => {
      dispatch({ type: "UPDATE_GAME", payload: game });
    };

    const handleMoveMade = (data: { move: Move; game: Game }) => {
      dispatch({ type: "UPDATE_GAME", payload: data.game });
    };

    const handleMoveError = (data: { error: string }) => {
      dispatch({ type: "SET_ERROR", payload: data.error });
    };

    const handleGameEnded = (data: {
      result: any;
      reason: any;
      game: Game;
    }) => {
      console.log("Game ended:", data);
      dispatch({ type: "UPDATE_GAME", payload: data.game });
    };

    const handleError = (data: { error: string }) => {
      dispatch({ type: "SET_ERROR", payload: data.error });
    };

    const handleDrawOffered = (data: { game: Game }) => {
      dispatch({ type: "UPDATE_GAME", payload: data.game });
    };

    const handleTimerSync = (data: {
      whiteTime: number;
      blackTime: number;
      turn: "w" | "b";
      serverTimestamp: number;
      isPaused: boolean;
    }) => {
      if (state.game && state.game.timers) {
        const updatedGame = {
          ...state.game,
          timers: {
            increment: state.game.timers.increment,
            lastMoveTime: state.game.timers.lastMoveTime,
            pausedAt: state.game.timers.pausedAt,
            whiteTime: data.whiteTime,
            blackTime: data.blackTime,
            serverTimestamp: data.serverTimestamp,
            isPaused: data.isPaused,
          },
          turn: data.turn,
        };
        dispatch({ type: "UPDATE_GAME", payload: updatedGame });
      }
    };

    // Register event listeners
    socket.on("game_joined", handleGameJoined);
    socket.on("game_updated", handleGameUpdated);
    socket.on("move_made", handleMoveMade);
    socket.on("move_error", handleMoveError);
    socket.on("game_ended", handleGameEnded);
    socket.on("error_message", handleError);
    socket.on("draw_offered", handleDrawOffered);
    socket.on("timer_sync", handleTimerSync);

    return () => {
      socket.off("game_joined", handleGameJoined);
      socket.off("game_updated", handleGameUpdated);
      socket.off("move_made", handleMoveMade);
      socket.off("move_error", handleMoveError);
      socket.off("game_ended", handleGameEnded);
      socket.off("error_message", handleError);
      socket.off("draw_offered", handleDrawOffered);
      socket.off("timer_sync", handleTimerSync);
    };
  }, [socket]);

  useEffect(() => {
    dispatch({ type: "SET_CONNECTED", payload: status === "connected" });
  }, [status]);

  useEffect(() => {
    if (roomId && socket && socket.connected && !state.game) {
      const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      joinGame(guestId, roomId, "Player");
    }
  }, [roomId, socket, status, state.game]);

  const joinGame = (guestId: string, roomId?: string, playerName?: string) => {
    if (!socket || !socket.connected) {
      dispatch({ type: "SET_ERROR", payload: "Not connected to server" });
      return;
    }

    socket.emit("join", { guestId, roomId, playerName });
  };

  const makeMove = (move: Move) => {
    if (!socket || !socket.connected || !state.game) {
      dispatch({
        type: "SET_ERROR",
        payload: "Cannot make move: not connected or no game",
      });
      return;
    }

    socket.emit("move", { roomId: state.game.roomId, move });
  };

  const offerDraw = () => {
    if (!socket || !socket.connected || !state.game) {
      dispatch({
        type: "SET_ERROR",
        payload: "Cannot offer draw: not connected or no game",
      });
      return;
    }

    socket.emit("offer_draw", { roomId: state.game.roomId });
  };

  const acceptDraw = () => {
    if (!socket || !socket.connected || !state.game) {
      dispatch({
        type: "SET_ERROR",
        payload: "Cannot accept draw: not connected or no game",
      });
      return;
    }

    socket.emit("accept_draw", { roomId: state.game.roomId });
  };

  const resign = () => {
    if (!socket || !socket.connected || !state.game) {
      dispatch({
        type: "SET_ERROR",
        payload: "Cannot resign: not connected or no game",
      });
      return;
    }

    socket.emit("resign", { roomId: state.game.roomId });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const requestTimerSync = () => {
    if (!socket || !socket.connected || !state.game) {
      return;
    }

    socket.emit("request_timer_sync", { roomId: state.game.roomId });
  };

  const value: GameContextType = {
    ...state,
    joinGame,
    makeMove,
    offerDraw,
    acceptDraw,
    resign,
    clearError,
    requestTimerSync,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
