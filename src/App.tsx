import { useEffect, useState } from "react";
import { Button } from "./components/button";
import { DigitalClock } from "./components/digital-clock";
import { Input } from "./components/input";
import { Label } from "./components/label";
import { ProgressCircle } from "./components/progress-circle";
import { StatCard } from "./components/stat-card";
import { ThemeSwitcher } from "./components/theme-switcher";
import { useTheme } from "./contexts/theme-context";
import {
  playCountdown,
  playFinishSet,
  playFinishWorkout,
  playSound,
} from "./utils/sounds";

export default function App() {
  const [time, setTime] = useState(40);
  const [isActive, setIsActive] = useState(false);
  const [restTime, setRestTime] = useState(30);
  const [isResting, setIsResting] = useState(false);
  const [sets, setSets] = useState(0);
  const [totalSets, setTotalSets] = useState(10);
  const [jumpDuration, setJumpDuration] = useState(40);
  const [totalTime, setTotalTime] = useState(0);
  const [estimatedCalories, setEstimatedCalories] = useState(0);

  useEffect(() => {
    const totalJumpTime = totalSets * jumpDuration;
    const totalRestTime = (totalSets - 1) * restTime;
    const newTotalTime = totalJumpTime + totalRestTime;
    setTotalTime(newTotalTime);

    const jumpTimeInMinutes = totalJumpTime / 60;
    const estimatedCal = Math.round(jumpTimeInMinutes * 8.67);
    setEstimatedCalories(estimatedCal);
  }, [totalSets, jumpDuration, restTime]);

  useEffect(() => {
    let interval: number | undefined = undefined;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      if (isResting) {
        setIsResting(false);
        setTime(jumpDuration);
        playSound("start");
      } else {
        setSets((sets) => sets + 1);
        if (sets + 1 >= totalSets) {
          setIsActive(false);
          setIsResting(false);
          playFinishWorkout();
        } else {
          setIsResting(true);
          setTime(restTime);
          playFinishSet();
        }
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time, isResting, restTime, jumpDuration, sets, totalSets]);

  const toggleTimer = async () => {
    if (!isActive) {
      await playCountdown();
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(jumpDuration);
    setIsResting(false);
    setSets(0);
  };

  const handleRestTimeChange = (e: { target: { value: string } }) => {
    setRestTime(parseInt(e.target.value) || 0);
  };

  const handleTotalSetsChange = (e: { target: { value: string } }) => {
    setTotalSets(parseInt(e.target.value) || 0);
  };

  const handleJumpDurationChange = (e: { target: { value: string } }) => {
    const newDuration = parseInt(e.target.value) || 0;
    setJumpDuration(newDuration);
    setTime(newDuration);
  };

  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animated-gradient-bg">
      <div
        className={`p-6 glass-effect rounded-[20px] w-full max-w-md transition-all duration-300 ${
          theme === "dark" ? "text-white border-slate-700" : "border-white/20"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-400">
            {isResting ? "เวลาพัก 💤" : "กระโดดเชือก 🔥"}
          </h1>
          <ThemeSwitcher />
        </div>

        <div className="mb-6 hover-lift">
          <div className="relative flex w-full">
            <ProgressCircle
              progress={
                (isResting
                  ? (restTime - time) / restTime
                  : (jumpDuration - time) / jumpDuration) * 100
              }
              size={220}
              strokeWidth={15}
              progressColor={isResting ? "#10b981" : "#6d28d9"}
              bgColor={theme === "dark" ? "#334155" : "#e2e8f0"}
              className={`mx-auto ${isActive ? "glow" : ""}`}
            >
              <div className="flex flex-col items-center justify-center">
                <DigitalClock
                  minutes={Math.floor(time / 60)}
                  seconds={time % 60}
                  isActive={isActive}
                  isPulsing={isActive && time <= 5}
                  className="scale-110 mb-2"
                />
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    isResting
                      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                      : "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300"
                  }`}
                >
                  {isResting ? "พักผ่อน" : "กำลังกระโดด"}
                </span>
              </div>
            </ProgressCircle>

            {isActive && (
              <span
                className={`absolute top-0 right-0 w-4 h-4 rounded-full ${
                  isResting ? "bg-green-400" : "bg-indigo-500"
                } animate-ping-slow`}
              />
            )}
          </div>
        </div>

        <div className="flex space-x-2 mb-4">
          <Button
            onClick={toggleTimer}
            className={`flex-1 neon-btn ${
              !isActive
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isActive ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                  หยุด
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  เริ่ม
                </>
              )}
            </span>
          </Button>
          <Button onClick={resetTimer} className="flex-1 neon-btn">
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 2v6h6"></path>
                <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                <path d="M21 22v-6h-6"></path>
                <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
              </svg>
              รีเซ็ต
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label
              htmlFor="jumpDuration"
              className="inline-flex items-center gap-2"
            >
              <span className="bg-indigo-500 text-white p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                ⏱️
              </span>
              เวลากระโดด (วิ)
            </Label>
            <Input
              id="jumpDuration"
              type="number"
              value={jumpDuration}
              onChange={handleJumpDurationChange}
              className={`w-full border-2 ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white/80 border-slate-200"
              }`}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="restTime"
              className="inline-flex items-center gap-2"
            >
              <span className="bg-green-500 text-white p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                🛌
              </span>
              เวลาพัก (วิ)
            </Label>
            <Input
              id="restTime"
              type="number"
              value={restTime}
              onChange={handleRestTimeChange}
              className={`w-full border-2 ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white/80 border-slate-200"
              }`}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="totalSets"
              className="inline-flex items-center gap-2"
            >
              <span className="bg-violet-500 text-white p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                🔄
              </span>
              จำนวนเซ็ท
            </Label>
            <Input
              id="totalSets"
              type="number"
              value={totalSets}
              onChange={handleTotalSetsChange}
              className={`w-full border-2 ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white/80 border-slate-200"
              }`}
            />
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-violet-500"></span>
                เซ็ตที่ทำแล้ว
              </span>
              <span className="bg-violet-500/20 text-violet-600 dark:text-violet-300 px-2 py-0.5 rounded-md text-xs font-bold">
                {sets} / {totalSets}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${(sets / totalSets) * 100}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 my-4">
            <StatCard
              title="แคลอรี่"
              value={estimatedCalories}
              unit="kcal"
              icon="🔥"
              color="success"
              className="animate-float"
            />
            <StatCard
              title="เวลารวม"
              value={`${Math.floor(totalTime / 60)}:${
                totalTime % 60 < 10 ? "0" : ""
              }${totalTime % 60}`}
              unit="min:sec"
              icon="⏱️"
              color="primary"
            />
          </div>
        </div>
        <div
          className={`p-3 rounded-lg mb-2 text-sm ${
            isResting
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : isActive
              ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-xl ${isActive ? "animate-pulse" : ""}`}>
              {isResting ? "💤" : isActive ? "🔥" : "🏃"}
            </span>
            <p>
              {isResting
                ? "กำลังพัก... เตรียมตัวกระโดดเชือกรอบต่อไป!"
                : isActive
                ? "กำลังกระโดดเชือก... สู้ๆ!"
                : "พร้อมเริ่มการออกกำลังกาย"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
