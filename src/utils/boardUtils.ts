import { Square } from "chess.js";

export const SQUARE_STYLES = {
  HIGHLIGHT: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
  RIGHT_CLICK: { backgroundColor: "rgba(0, 0, 255, 0.4)" },
  SELECTED: { background: "var(--primary)" },
  MOVE_TARGET: {
    background: "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
    borderRadius: "50%",
  },
  CAPTURE_TARGET: {
    background: "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)",
    borderRadius: "50%",
  },
} as const;

export const BOARD_CONFIG = {
  ANIMATION_DURATION: 200,
  MAX_BOARD_SIZE: 700,
  ENABLE_ARROWS: true,
  ENABLE_PREMOVES: false,
} as const;

export const PIECE_NAMES = {
  wP: "White Pawn",
  wN: "White Knight",
  wB: "White Bishop",
  wR: "White Rook",
  wQ: "White Queen",
  wK: "White King",
  bP: "Black Pawn",
  bN: "Black Knight",
  bB: "Black Bishop",
  bR: "Black Rook",
  bQ: "Black Queen",
  bK: "Black King",
} as const;

export const isValidSquare = (square: string): square is Square => {
  return /^[a-h][1-8]$/.test(square);
};

export const getSquareColor = (square: Square): "light" | "dark" => {
  const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
  const rank = parseInt(square[1]) - 1; // 1=0, 2=1, etc.
  return (file + rank) % 2 === 0 ? "dark" : "light";
};

export const formatSquare = (square: Square): string => {
  return `${square[0].toUpperCase()}${square[1]}`;
};

export const isCastleMove = (from: Square, to: Square): boolean => {
  return (
    (from === "e1" && (to === "g1" || to === "c1")) ||
    (from === "e8" && (to === "g8" || to === "c8"))
  );
};

export const isEnPassantCapture = (move: any): boolean => {
  return move.flags && move.flags.includes("e");
};

export const isPromotion = (move: any): boolean => {
  return move.flags && move.flags.includes("p");
};
