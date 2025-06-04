"use client";

import React, { useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { useGame } from "@/context/GameProvider";
import { PlayerRole, GameStatus } from "@/types/game";
import { useBoardState } from "@/hooks/useBoardState";
import { useBoardInteractions } from "@/hooks/useBoardInteractions";

interface BoardProps {
  className?: string;
  currentMoveIndex: number;
}

export default function Board({ className, currentMoveIndex }: BoardProps) {
  const { game, playerColor, chess, makeMove, isSpectator } = useGame();

  const boardState = useBoardState({
    game,
    chess,
    currentMoveIndex,
    isSpectator,
    playerColor,
  });

  const boardInteractions = useBoardInteractions({
    chess,
    game,
    isPlayerTurn: boardState.isPlayerTurn,
    canInteract: boardState.canInteract,
    moveFrom: boardState.moveFrom,
    rightClickedSquares: boardState.rightClickedSquares,
    getMoveOptions: boardState.getMoveOptions,
    clearSelection: boardState.clearSelection,
    setMoveFrom: boardState.setMoveFrom,
    makeMove,
    setRightClickedSquares: boardState.setRightClickedSquares,
  });

  const boardOrientation = useMemo(() => {
    return playerColor === PlayerRole.BLACK ? "black" : "white";
  }, [playerColor]);

  // Combine all square styles
  const customSquareStyles = useMemo(
    () => ({
      ...boardState.moveSquares,
      ...boardState.optionSquares,
      ...boardState.rightClickedSquares,
    }),
    [
      boardState.moveSquares,
      boardState.optionSquares,
      boardState.rightClickedSquares,
    ],
  );

  if (!game || !boardState.displayChess) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
        role="status"
        aria-label="Loading game"
      >
        <div className="text-gray-500">Loading game...</div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
    >
      <div className="aspect-square w-full max-w-[700px]">
        <Chessboard
          position={boardState.displayChess.fen()}
          onSquareClick={boardInteractions.onSquareClick}
          onSquareRightClick={boardInteractions.onSquareRightClick}
          onPieceDragBegin={boardInteractions.onPieceDragBegin}
          onPieceDrop={boardInteractions.onPieceDrop}
          onPieceDragEnd={boardInteractions.onPieceDragEnd}
          boardOrientation={boardOrientation}
          customSquareStyles={customSquareStyles}
          arePiecesDraggable={
            boardState.canInteract &&
            boardState.isPlayerTurn &&
            game.status === GameStatus.ACTIVE
          }
          animationDuration={200}
          areArrowsAllowed={true}
          arePremovesAllowed={false}
          showPromotionDialog={false}
        />
      </div>
    </div>
  );
}
