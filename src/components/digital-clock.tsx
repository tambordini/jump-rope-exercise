import React from "react";
import { cn } from "../lib/utils";

interface DigitalClockProps {
  minutes: number;
  seconds: number;
  isActive?: boolean;
  isPulsing?: boolean;
  className?: string;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  minutes,
  seconds,
  isActive = false,
  isPulsing = false,
  className,
}) => {
  // Format numbers to always have two digits
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center font-mono",
        isPulsing && "animate-pulse",
        className
      )}
    >
      <div className="flex items-center">
        <div className="bg-slate-800/80 dark:bg-slate-900 text-white px-3 py-2 rounded-lg min-w-[60px] text-center">
          {formatNumber(minutes)}
        </div>
        <div className="mx-1 text-xl font-bold">:</div>
        <div
          className={cn(
            "bg-slate-800/80 dark:bg-slate-900 text-white px-3 py-2 rounded-lg min-w-[60px] text-center",
            isActive && seconds <= 5 && "bg-red-600 dark:bg-red-700"
          )}
        >
          {formatNumber(seconds)}
        </div>
      </div>
    </div>
  );
};
