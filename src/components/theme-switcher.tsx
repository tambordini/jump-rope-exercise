import { useTheme } from "../contexts/theme-context";
import { cn } from "../lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center p-1 w-12 h-6 rounded-full transition-colors",
        theme === "dark" ? "bg-slate-700" : "bg-slate-200",
        className
      )}
      aria-label="Toggle dark mode"
    >
      <div
        className={cn(
          "absolute z-10 w-5 h-5 rounded-full transform transition-transform duration-300",
          theme === "dark"
            ? "translate-x-[40%] bg-violet-500"
            : "translate-x-[-40%] bg-amber-400"
        )}
      />
      <span className="sr-only">Toggle theme</span>

      <span className="absolute left-1.5 text-xs text-amber-500">☀️</span>
      <span className="absolute right-1.5 text-xs text-slate-300">🌙</span>
    </button>
  );
}
