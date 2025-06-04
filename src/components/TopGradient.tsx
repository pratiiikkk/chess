"use client";

import React from "react";

interface BackgroundGradientProps {
  className?: string;
}

export default function TopBackgroundGradient({
  className = "",
}: BackgroundGradientProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="absolute -top-[15%] right-[0%] h-[8%] w-[100%] blur-3xl mx-auto"
        style={{
          background: "#edd0b8",
          backgroundImage:
            "linear-gradient(nulldeg,rgba(255, 255, 255, 1) 100%, rgba(0, 0, 0, 1) 100%)",
        }}
      ></div>
    </div>
  );
}
