"use client";

import { useCallback } from "react";
import { Square, Move } from "chess.js";
import { SoundType, useSounds } from "@/hooks/useSounds";
import { SQUARE_STYLES, isPromotion, isCastleMove } from "@/utils/boardUtils";

interface UseBoardInteractionsProps {
  chess: any;
  game: any;
  isPlayerTurn: boolean;
  canInteract: boolean;
  moveFrom: Square | null;
  rightClickedSquares: { [key: string]: any };
  getMoveOptions: (square: Square) => Move[];
  clearSelection: () => void;
  setMoveFrom: (square: Square | null) => void;
  makeMove: (move: any) => void;
  setRightClickedSquares: (squares: { [key: string]: any }) => void;
}

export const useBoardInteractions = ({
  chess,
  game,
  isPlayerTurn,
  canInteract,
  moveFrom,
  rightClickedSquares,
  getMoveOptions,
  clearSelection,
  setMoveFrom,
  makeMove,
  setRightClickedSquares,
}: UseBoardInteractionsProps) => {
  const { playSound } = useSounds();

  const validateMove = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      if (!chess || !canInteract) return null;

      const moves = chess.moves({
        square: sourceSquare,
        verbose: true,
      });

      return moves.find(
        (m: Move) => m.from === sourceSquare && m.to === targetSquare,
      );
    },
    [chess, canInteract],
  );

  const createMoveObject = useCallback(
    (sourceSquare: Square, targetSquare: Square, foundMove: Move) => {
      const move: any = {
        from: sourceSquare,
        to: targetSquare,
      };

      // TODO: Add promotion dialog for user choice
      if (isPromotion(foundMove)) {
        move.promotion = "q";
      }

      return move;
    },
    [],
  );

  const handleMoveAttempt = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      const foundMove = validateMove(sourceSquare, targetSquare);

      if (!foundMove) {
        return false;
      }

      const move = createMoveObject(sourceSquare, targetSquare, foundMove);

      try {
        makeMove(move);
        clearSelection();

        if (foundMove.captured) {
          playSound(SoundType.CAPTURE);
        } else if (isCastleMove(sourceSquare, targetSquare)) {
          playSound(SoundType.CASTLE);
        } else if (chess.inCheck()) {
          playSound(SoundType.CHECK);
        } else {
          playSound(SoundType.MOVE);
        }

        return true;
      } catch (error) {
        console.error("Move failed:", error);
        clearSelection();
        return false;
      }
    },
    [
      validateMove,
      createMoveObject,
      makeMove,
      clearSelection,
      playSound,
      chess,
    ],
  );

  const onSquareClick = useCallback(
    (square: Square) => {
      if (!canInteract || !isPlayerTurn) return;

      // Ignore right-clicked squares
      if (rightClickedSquares[square]) return;

      // First click - select piece
      if (!moveFrom) {
        const piece = chess.get(square);
        if (piece && piece.color === game.turn) {
          setMoveFrom(square);
          getMoveOptions(square);
        }
        return;
      }

      // Second click - attempt move or select new piece
      const success = handleMoveAttempt(moveFrom, square);

      if (!success) {
        // Check if clicking on another piece of the same color
        const piece = chess.get(square);
        if (piece && piece.color === game.turn) {
          setMoveFrom(square);
          getMoveOptions(square);
        } else {
          clearSelection();
        }
      }
    },
    [
      canInteract,
      isPlayerTurn,
      rightClickedSquares,
      moveFrom,
      chess,
      game,
      setMoveFrom,
      getMoveOptions,
      handleMoveAttempt,
      clearSelection,
    ],
  );

  const onSquareRightClick = useCallback(
    (square: Square) => {
      setRightClickedSquares({
        ...rightClickedSquares,
        [square]:
          rightClickedSquares[square] &&
          rightClickedSquares[square].backgroundColor ===
            SQUARE_STYLES.RIGHT_CLICK.backgroundColor
            ? undefined
            : SQUARE_STYLES.RIGHT_CLICK,
      });
    },
    [rightClickedSquares, setRightClickedSquares],
  );

  const onPieceDragBegin = useCallback(
    (piece: string, sourceSquare: Square) => {
      if (!canInteract || !isPlayerTurn) return false;

      // Check if the piece being dragged belongs to the current player
      const pieceOnSquare = chess.get(sourceSquare);
      if (!pieceOnSquare || pieceOnSquare.color !== game.turn) return false;

      setMoveFrom(sourceSquare);
      getMoveOptions(sourceSquare);
      return true;
    },
    [canInteract, isPlayerTurn, chess, game, setMoveFrom, getMoveOptions],
  );

  const onPieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      if (!canInteract || !isPlayerTurn) {
        clearSelection();
        return false;
      }

      return handleMoveAttempt(sourceSquare, targetSquare);
    },
    [canInteract, isPlayerTurn, handleMoveAttempt, clearSelection],
  );

  const onPieceDragEnd = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return {
    onSquareClick,
    onSquareRightClick,
    onPieceDragBegin,
    onPieceDrop,
    onPieceDragEnd,
  };
};
