import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";

interface CountdownProps {
  /**
   * เวลาที่เหลือ (วินาที)
   */
  seconds: number;

  /**
   * สถานะการนับถอยหลัง (เริ่มหรือหยุด)
   */
  isActive: boolean;

  /**
   * สถานะว่ากำลังพักหรือกระโดด
   */
  isResting?: boolean;

  /**
   * คลาสเพิ่มเติม
   */
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  seconds,
  isActive,
  isResting,
  className,
}) => {
  const [pulse, setPulse] = useState(false);

  // สร้าง pulse animation เมื่อวินาทีเปลี่ยน
  useEffect(() => {
    if (seconds <= 5 && isActive) {
      setPulse(true);
      const timeout = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [seconds, isActive]);

  // สีและสถานะต่างๆ
  const isLowTime = seconds <= 5 && isActive;
  const textColor = isResting
    ? "text-green-600"
    : isLowTime
    ? "text-red-600"
    : "text-slate-800";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div
      className={cn(
        "text-6xl font-bold text-center transition-all",
        textColor,
        pulse && "scale-110",
        className
      )}
      style={{
        transition: pulse ? "all 0.15s ease-out" : "all 0.5s ease",
      }}
    >
      {minutes}:{remainingSeconds < 10 ? "0" : ""}
      {remainingSeconds}
    </div>
  );
};
