"use client";

import React, { useState, useEffect } from "react";
import { Move } from "chess.js";
import {
  IconArrowLeft,
  IconArrowRight,
  IconWind,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import { ScrollArea } from "../ui/scroll-area";

interface MoveHistoryProps {
  moves: Move[];
  currentMoveIndex?: number;
  onNavigateToMove?: (moveIndex: number) => void;
  className?: string;
}

interface ProcessedMove {
  num: number;
  white: string;
  black: string;
  whiteIndex: number;
  blackIndex: number;
}

export default function MoveHistory({
  moves,
  currentMoveIndex = moves.length - 1,
  onNavigateToMove,
  className = "",
}: MoveHistoryProps) {
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(currentMoveIndex);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setSelectedMoveIndex(currentMoveIndex);
  }, [currentMoveIndex]);

  const processedMoves: ProcessedMove[] = moves.reduce(
    (acc: ProcessedMove[], move, index) => {
      const moveNumber = Math.floor(index / 2) + 1;
      const isWhiteMove = index % 2 === 0;

      if (isWhiteMove) {
        acc.push({
          num: moveNumber,
          white: move.san,
          black: moves[index + 1]?.san || "",
          whiteIndex: index,
          blackIndex: index + 1,
        });
      }
      return acc;
    },
    [],
  );

  const navigateToMove = (moveIndex: number) => {
    const clampedIndex = Math.max(-1, Math.min(moves.length - 1, moveIndex));
    setSelectedMoveIndex(clampedIndex);
    onNavigateToMove?.(clampedIndex);
  };

  const navigateToStart = () => navigateToMove(-1);
  const navigateToEnd = () => navigateToMove(moves.length - 1);
  const navigatePrevious = () => navigateToMove(selectedMoveIndex - 1);
  const navigateNext = () => navigateToMove(selectedMoveIndex + 1);

  const canNavigatePrevious = selectedMoveIndex > -1;
  const canNavigateNext = selectedMoveIndex < moves.length - 1;

  return (
    <div
      className={`bg-card flex-1 overflow-hidden rounded-lg ${className} shadow-2xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-800 px-4 py-3">
        <h3 className="text-sm font-medium text-white">Moves</h3>
        <div className="flex gap-1">
          <button
            onClick={navigateToStart}
            disabled={!canNavigatePrevious}
            className="rounded p-1 hover:bg-[#3a3734] disabled:cursor-not-allowed disabled:opacity-50"
            title="Go to start"
          >
            <IconWind className="h-4 w-4 text-neutral-400" />
          </button>
          <button
            onClick={navigatePrevious}
            disabled={!canNavigatePrevious}
            className="rounded p-1 hover:bg-[#3a3734] disabled:cursor-not-allowed disabled:opacity-50"
            title="Previous move"
          >
            <IconArrowLeft className="h-4 w-4 text-neutral-400" />
          </button>
          <button
            onClick={navigateNext}
            disabled={!canNavigateNext}
            className="rounded p-1 hover:bg-[#3a3734] disabled:cursor-not-allowed disabled:opacity-50"
            title="Next move"
          >
            <IconArrowRight className="h-4 w-4 text-neutral-400" />
          </button>
          <button
            onClick={navigateToEnd}
            disabled={!canNavigateNext}
            className="rounded p-1 hover:bg-[#3a3734] disabled:cursor-not-allowed disabled:opacity-50"
            title="Go to end"
          >
            <IconPlayerSkipForward className="h-4 w-4 text-neutral-400" />
          </button>
         
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="border-b border-[#3a3734] bg-[#1a1714] px-4 py-2">
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="showCoordinates" className="rounded" />
              <label htmlFor="showCoordinates">Show coordinates</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="highlightLastMove"
                className="rounded"
                defaultChecked
              />
              <label htmlFor="highlightLastMove">Highlight last move</label>
            </div>
          </div>
        </div>
      )}

      {/* Move list */}

      <ScrollArea
      className="h-96 max-h-[40rem]"
      >
        <div className=" flex-1 overflow-y-auto p-3">
          <div className="space-y-0.5">
            {processedMoves.length === 0 ? (
              <div className="py-4 text-center text-sm text-neutral-400">
                No moves yet
              </div>
            ) : (
              processedMoves.map((move) => (
                <div
                  key={move.num}
                  className="grid cursor-pointer grid-cols-[30px_1fr_1fr] gap-1 rounded py-0.5 text-sm transition-colors"
                >
                  <span className="p-1 text-xs text-neutral-400">
                    {move.num}.
                  </span>

                  {/* White move */}
                  <button
                    onClick={() => navigateToMove(move.whiteIndex)}
                    className={`cursor-pointer rounded p-1 text-left font-mono text-xs transition-colors hover:bg-neutral-600 ${
                      selectedMoveIndex === move.whiteIndex
                        ? "bg-secondary text-white"
                        : "text-white"
                    }`}
                  >
                    {move.white}
                  </button>

                  {/* Black move */}
                  {move.black && (
                    <button
                      onClick={() => navigateToMove(move.blackIndex)}
                      className={`cursor-pointer rounded p-1 text-left font-mono text-xs transition-colors hover:bg-neutral-600 hover:text-white ${
                        selectedMoveIndex === move.blackIndex
                          ? "bg-neutral-700 text-white"
                          : "text-white"
                      }`}
                    >
                      {move.black}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Current position indicator */}
      <div className="border-t border-neutral-700 bg-neutral-800 p-3">
        <div className="text-center">
          <div className="text-sm font-semibold text-neutral-400">
            {selectedMoveIndex === -1
              ? "Starting position"
              : selectedMoveIndex === moves.length - 1
                ? "Current position"
                : `Move ${selectedMoveIndex + 1} of ${moves.length}`}
          </div>
          <div className="text-xs text-neutral-400">
            {selectedMoveIndex >= 0 && moves[selectedMoveIndex] && (
              <>
                {Math.floor(selectedMoveIndex / 2) + 1}.
                {selectedMoveIndex % 2 === 0 ? "" : ".."}
                {moves[selectedMoveIndex].san}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
