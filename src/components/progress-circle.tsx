import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";

interface ProgressCircleProps {
  /**
   * ค่าความคืบหน้าปัจจุบัน (0-100)
   */
  progress: number;

  /**
   * ขนาดของวงกลม (พิกเซล)
   */
  size?: number;

  /**
   * ความหนาของเส้น (พิกเซล)
   */
  strokeWidth?: number;

  /**
   * สีของวงกลมความคืบหน้า
   */
  progressColor?: string;

  /**
   * สีของวงกลมพื้นหลัง
   */
  bgColor?: string;

  /**
   * เนื้อหาที่จะแสดงภายในวงกลม
   */
  children?: React.ReactNode;

  /**
   * คลาสเพิ่มเติมสำหรับคอนเทนเนอร์
   */
  className?: string;

  /**
   * ทิศทางการเคลื่อนที่ (ตามเข็มนาฬิกาหรือทวนเข็มนาฬิกา)
   */
  counterClockwise?: boolean;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 200,
  strokeWidth = 15,
  progressColor = "#4f46e5", // สี indigo-600
  bgColor = "#e5e7eb", // สี gray-200
  children,
  className,
  counterClockwise = false,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  // คำนวณค่าต่างๆสำหรับวงกลม
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // อนิเมชั่นการเปลี่ยนความคืบหน้า
  useEffect(() => {
    // รีเซ็ตเมื่อ progress เป็น 0
    if (progress === 0) {
      setDisplayProgress(0);
      return;
    }

    // อนิเมทไปยังค่าใหม่
    const timeout = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);

    return () => clearTimeout(timeout);
  }, [progress]);

  // คำนวณความยาวของเส้น arc
  const strokeDashoffset =
    circumference - (displayProgress / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* วงกลมพื้นหลัง */}
      <svg width={size} height={size} className="absolute inset-0">
        <circle
          className="transition-colors duration-300"
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className="transition-all duration-700 ease-out"
          stroke={progressColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={
            counterClockwise ? -strokeDashoffset : strokeDashoffset
          }
          strokeLinecap="round"
          r={radius}
          cx={center}
          cy={center}
          style={{
            transform: counterClockwise ? "rotate(90deg)" : "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
      </svg>

      {/* เนื้อหาภายในวงกลม */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
};
