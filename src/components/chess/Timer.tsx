"use client";

import React, { useEffect, useState, useRef } from "react";
import { IconClock } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/context/GameProvider";

interface TimerProps {
  timeMs: number;
  isActive: boolean;
  playerName: string;
  className?: string;
  serverTimestamp?: number;
  originalTime?: number;
}

export default function Timer({
  timeMs,
  isActive,
  playerName,
  className = "",
  serverTimestamp,
  originalTime = 10 * 60 * 1000, // 10 minutes default
}: TimerProps) {
  const [displayTime, setDisplayTime] = useState(timeMs);
  const lastSyncRef = useRef<number>(Date.now());
  const { requestTimerSync } = useGame();

  // Sync with server time when server timestamp is provided
  useEffect(() => {
    if (serverTimestamp) {
      const now = Date.now();
      const timeSinceServerUpdate = now - serverTimestamp;

      // Adjust for network lag and time since server update
      let adjustedTime = timeMs;
      if (isActive) {
        adjustedTime = Math.max(0, timeMs - timeSinceServerUpdate);
      }

      setDisplayTime(adjustedTime);
      lastSyncRef.current = now;
    } else {
      setDisplayTime(timeMs);
    }
  }, [timeMs, serverTimestamp, isActive]);

  // Client-side countdown when active
  useEffect(() => {
    if (!isActive || displayTime <= 0) return;

    const interval = setInterval(() => {
      setDisplayTime((prev) => Math.max(0, prev - 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, displayTime]);

  // Request timer sync periodically for active timers
  useEffect(() => {
    if (!isActive) return;

    const syncInterval = setInterval(() => {
      requestTimerSync();
    }, 10000); // Request sync every 10 seconds when timer is active

    return () => clearInterval(syncInterval);
  }, [isActive, requestTimerSync]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimePercentage = () => {
    // Use original time for percentage calculation
    return Math.max(0, Math.min(100, (displayTime / originalTime) * 100));
  };

  const isVeryLowTime = displayTime < 30000; // Less than 30 seconds
  const isLowTimeThreshold = displayTime < 60000; // Less than 1 minute

  return (
    <div
      className={cn(
        "rounded-md bg-neutral-700 px-2 py-1 text-muted",
        isActive && "bg-neutral-800 text-neutral-500",
        className,
      )}
    >
      <div className="text-right">
        <div
          className={cn(
            "flex items-center justify-end gap-1 font-mono text-xl",
            isVeryLowTime && "animate-pulse text-red-400",
            isLowTimeThreshold && !isVeryLowTime && "text-yellow-400",
            !isLowTimeThreshold && "text-white",
            !isActive && "text-muted-foreground"
          )}
        >
          <IconClock className={cn("h-4 w-4", isActive && "animate-spin")} />
          {formatTime(displayTime)}
        </div>

        {/* Progress bar */}
        {/* <div className="mt-1 h-1 w-16 rounded-full bg-gray-600 ml-auto">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isVeryLowTime ? 'bg-red-400' :
              isLowTimeThreshold ? 'bg-yellow-400' :
              'bg-white'
            }`}
            style={{ width: `${getTimePercentage()}%` }}
          ></div>
        </div> */}
      </div>
    </div>
  );
}
