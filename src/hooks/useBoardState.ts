"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Square, Chess, Move } from "chess.js";
import { Game, PlayerRole, GameStatus } from "@/types/game";
import { SQUARE_STYLES } from "@/utils/boardUtils";

interface SquareStyles {
  [key: string]: {
    backgroundColor?: string;
    background?: string;
    borderRadius?: string;
  };
}

interface UseBoardStateProps {
  game: Game | null;
  chess: Chess | null;
  currentMoveIndex: number;
  isSpectator: boolean;
  playerColor: PlayerRole | null;
}

export const useBoardState = ({
  game,
  chess,
  currentMoveIndex,
  isSpectator,
  playerColor,
}: UseBoardStateProps) => {
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareStyles>(
    {},
  );
  const [moveSquares, setMoveSquares] = useState<SquareStyles>({});
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});

  const displayChess = useMemo(() => {
    if (!game?.moves || !chess) return chess;

    const tempChess = new Chess();

    if (currentMoveIndex === -1) {
      return tempChess;
    }

    try {
      for (let i = 0; i <= currentMoveIndex && i < game.moves.length; i++) {
        tempChess.move(game.moves[i]);
      }
      return tempChess;
    } catch (error) {
      console.error("Error creating display position:", error);
      return chess;
    }
  }, [game?.moves, currentMoveIndex, chess]);

  // Check if we're viewing history (not at the latest move)
  const isViewingHistory = useMemo(() => {
    if (!game?.moves) return false;
    return currentMoveIndex < game.moves.length - 1;
  }, [currentMoveIndex, game?.moves]);

  const isPlayerTurn = useMemo(() => {
    if (!game || isSpectator || isViewingHistory) return false;
    return (
      (game.turn === "w" && playerColor === PlayerRole.WHITE) ||
      (game.turn === "b" && playerColor === PlayerRole.BLACK)
    );
  }, [game?.turn, playerColor, isSpectator, isViewingHistory]);

  const canInteract = useMemo(() => {
    return (
      game?.status === GameStatus.ACTIVE && !isSpectator && !isViewingHistory
    );
  }, [game?.status, isSpectator, isViewingHistory]);

  const resetHighlights = useCallback(() => {
    setMoveFrom(null);
    setRightClickedSquares({});
    setMoveSquares({});
    setOptionSquares({});
  }, []);

  useEffect(() => {
    resetHighlights();
  }, [game?.roomId, isViewingHistory, resetHighlights]);

  // Update move squares to highlight the last move at current position
  useEffect(() => {
    if (!game?.moves || currentMoveIndex < 0) {
      setMoveSquares({});
      return;
    }

    if (currentMoveIndex < game.moves.length) {
      const lastMove = game.moves[currentMoveIndex];
      if (lastMove) {
        // Parse the move to get from/to squares
        const tempChess = new Chess();
        for (let i = 0; i < currentMoveIndex; i++) {
          tempChess.move(game.moves[i]);
        }

        try {
          const moveObj = tempChess.move(lastMove);
          setMoveSquares({
            [moveObj.from]: SQUARE_STYLES.HIGHLIGHT,
            [moveObj.to]: SQUARE_STYLES.HIGHLIGHT,
          });
        } catch (error) {
          setMoveSquares({});
        }
      }
    } else {
      setMoveSquares({});
    }
  }, [currentMoveIndex, game?.moves]);

  const getMoveOptions = useCallback(
    (square: Square) => {
      if (!displayChess || !canInteract) return [];

      const moves = displayChess.moves({
        square,
        verbose: true,
      });

      const newSquares: SquareStyles = {};
      moves.forEach((move) => {
        const toPiece = displayChess.get(move.to);
        const fromPiece = displayChess.get(square);
        newSquares[move.to] =
          toPiece && fromPiece && toPiece.color !== fromPiece.color
            ? SQUARE_STYLES.CAPTURE_TARGET
            : SQUARE_STYLES.MOVE_TARGET;
      });

      newSquares[square] = SQUARE_STYLES.SELECTED;

      setOptionSquares(newSquares);
      return moves;
    },
    [displayChess, canInteract],
  );

  const clearSelection = useCallback(() => {
    setMoveFrom(null);
    setOptionSquares({});
  }, []);

  return {
    moveFrom,
    rightClickedSquares,
    moveSquares,
    optionSquares,
    displayChess,
    isViewingHistory,
    isPlayerTurn,
    canInteract,

    setMoveFrom,
    setRightClickedSquares,
    setMoveSquares,
    setOptionSquares,
    getMoveOptions,
    clearSelection,
    resetHighlights,
  };
};
