"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Square, Chess } from "chess.js";
import { useGame } from "@/context/GameProvider";
import { PlayerRole, GameStatus } from "@/types/game";
import { SoundType, useSounds } from "@/hooks/useSounds";

interface BoardProps {
  className?: string;
  currentMoveIndex: number;
}

export default function Board({ className, currentMoveIndex }: BoardProps) {
  const { game, playerColor, chess, makeMove, isSpectator } = useGame();
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [rightClickedSquares, setRightClickedSquares] = useState<{
    [key: string]: any;
  }>({});
  const [moveSquares, setMoveSquares] = useState<{ [key: string]: any }>({});
  const [optionSquares, setOptionSquares] = useState<{ [key: string]: any }>(
    {},
  );
  const { playSound } = useSounds();

  // Create a chess instance for the current position based on currentMoveIndex
  const displayChess = useMemo(() => {
    if (!game || !game.moves) return chess;

    const tempChess = new Chess();
    
    // If currentMoveIndex is -1, show starting position
    if (currentMoveIndex === -1) {
      return tempChess;
    }

    // Replay moves up to currentMoveIndex
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

  // Reset highlights when game changes or when viewing history
  useEffect(() => {
    setMoveFrom(null);
    setRightClickedSquares({});
    setMoveSquares({});
    setOptionSquares({});
  }, [game?.roomId, isViewingHistory]);

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
            [moveObj.from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
            [moveObj.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
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
      if (!displayChess || isViewingHistory) return [];

      const moves = displayChess.moves({
        square,
        verbose: true,
      });

      const newSquares: { [key: string]: any } = {};
      moves.map((move) => {
        const toPiece = displayChess.get(move.to);
        const fromPiece = displayChess.get(square);
        newSquares[move.to] = {
          background:
            toPiece && fromPiece && toPiece.color !== fromPiece.color
              ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
              : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
          borderRadius: "50%",
        };
        return move;
      });

      newSquares[square] = {
        background: "var(--primary)",
      };

      setOptionSquares(newSquares);
      return moves;
    },
    [displayChess, isViewingHistory],
  );

  const onSquareClick = useCallback(
    (square: Square) => {
      if (!chess || !game || isSpectator || isViewingHistory) return;

     
      if (game.status !== GameStatus.ACTIVE) return;

      const isPlayerTurn =
        (game.turn === "w" && playerColor === PlayerRole.WHITE) ||
        (game.turn === "b" && playerColor === PlayerRole.BLACK);

      if (!isPlayerTurn) return;

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

      // Second click - make move or select new piece
      const moves = chess.moves({
        square: moveFrom,
        verbose: true,
      });

      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square,
      );

      if (!foundMove) {
        // Check if clicking on another piece of the same color
        const piece = chess.get(square);
        if (piece && piece.color === game.turn) {
          setMoveFrom(square);
          getMoveOptions(square);
        } else {
          // Invalid move or empty square
          setMoveFrom(null);
          setOptionSquares({});
        }
        return;
      }

    
      const move: any = {
        from: moveFrom,
        to: square,
      };

      if (foundMove.flags.includes("p")) {
        move.promotion = "q";
      }

    
      try {
        makeMove(move);
        setMoveFrom(null);
        setOptionSquares({});
        playSound(SoundType.MOVE);
      } catch (error) {
        console.error("Move failed:", error);
        setMoveFrom(null);
        setOptionSquares({});
      }
    },
    [
      chess,
      game,
      playerColor,
      isSpectator,
      isViewingHistory,
      moveFrom,
      rightClickedSquares,
      getMoveOptions,
      makeMove,
      playSound,
    ],
  );

  const onSquareRightClick = useCallback(
    (square: Square) => {
      const colour = "rgba(0, 0, 255, 0.4)";
      setRightClickedSquares({
        ...rightClickedSquares,
        [square]:
          rightClickedSquares[square] &&
          rightClickedSquares[square].backgroundColor === colour
            ? undefined
            : { backgroundColor: colour },
      });
    },
    [rightClickedSquares],
  );

  const onPieceDragBegin = useCallback(
    (piece: string, sourceSquare: Square) => {
      if (!chess || !game || isSpectator || isViewingHistory) return false;

      
      if (game.status !== GameStatus.ACTIVE) return false;

      const isPlayerTurn =
        (game.turn === "w" && playerColor === PlayerRole.WHITE) ||
        (game.turn === "b" && playerColor === PlayerRole.BLACK);

      if (!isPlayerTurn) return false;

      
      const pieceOnSquare = chess.get(sourceSquare);
      if (!pieceOnSquare || pieceOnSquare.color !== game.turn) return false;

      setMoveFrom(sourceSquare);
      getMoveOptions(sourceSquare);
      return true;
    },
    [chess, game, playerColor, isSpectator, isViewingHistory, getMoveOptions],
  );

  const onPieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      if (!chess || !game || isSpectator || isViewingHistory) return false;

      
      if (game.status !== GameStatus.ACTIVE) return false;

      const isPlayerTurn =
        (game.turn === "w" && playerColor === PlayerRole.WHITE) ||
        (game.turn === "b" && playerColor === PlayerRole.BLACK);

      if (!isPlayerTurn) return false;

      
      const moves = chess.moves({
        square: sourceSquare,
        verbose: true,
      });

      const foundMove = moves.find(
        (m) => m.from === sourceSquare && m.to === targetSquare,
      );

      if (!foundMove) {
        // Invalid move
        setMoveFrom(null);
        setOptionSquares({});
        return false;
      }

     
      const move: any = {
        from: sourceSquare,
        to: targetSquare,
      };

      if (foundMove.flags.includes("p")) {
        move.promotion = "q";
      }

     
      try {
        makeMove(move);
        setMoveFrom(null);
        setOptionSquares({});
        playSound(SoundType.MOVE);
        return true;
      } catch (error) {
        console.error("Move failed:", error);
        setMoveFrom(null);
        setOptionSquares({});
        return false;
      }
    },
    [chess, game, playerColor, isSpectator, isViewingHistory, makeMove, playSound],
  );

  const onPieceDragEnd = useCallback(() => {
    
    setMoveFrom(null);
    setOptionSquares({});
  }, []);

  if (!game || !displayChess) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <div className="text-gray-500">Loading game...</div>
      </div>
    );
  }

  
  const boardOrientation = playerColor === PlayerRole.BLACK ? "black" : "white";

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
    >
      <div className="aspect-square w-full max-w-[700px]">
        <Chessboard
          position={displayChess.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          onPieceDragBegin={onPieceDragBegin}
          onPieceDrop={onPieceDrop}
          onPieceDragEnd={onPieceDragEnd}
          boardOrientation={boardOrientation}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
          }}
          arePiecesDraggable={!isViewingHistory && !isSpectator && game.status === GameStatus.ACTIVE}
        />
      </div>
    </div>
  );
}