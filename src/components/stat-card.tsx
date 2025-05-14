import React from "react";
import { cn } from "../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  color = "default",
  className,
}) => {
  const colorStyles = {
    default: "bg-white dark:bg-slate-800",
    primary: "bg-indigo-50 dark:bg-indigo-900/20",
    success: "bg-green-50 dark:bg-green-900/20",
    warning: "bg-amber-50 dark:bg-amber-900/20",
    danger: "bg-red-50 dark:bg-red-900/20",
  };

  const textStyles = {
    default: "text-slate-800 dark:text-slate-200",
    primary: "text-indigo-700 dark:text-indigo-300",
    success: "text-green-700 dark:text-green-300",
    warning: "text-amber-700 dark:text-amber-300",
    danger: "text-red-700 dark:text-red-300",
  };

  return (
    <div
      className={cn(
        "p-4 rounded-xl border hover-lift",
        colorStyles[color],
        "border-slate-200 dark:border-slate-700",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider opacity-70">
          {title}
        </span>
        {icon && (
          <span className={cn("text-lg", textStyles[color])}>{icon}</span>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className={cn("text-2xl font-bold", textStyles[color])}>
          {value}
        </span>
        {unit && <span className="text-xs opacity-70 mb-1">{unit}</span>}
      </div>
    </div>
  );
};
