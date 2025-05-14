import { useEffect, useState } from "react";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { Label } from "./components/label";
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
  const [totalSets, setTotalSets] = useState(10); // เริ่มต้นที่ 10 เซ็ท
  const [jumpDuration, setJumpDuration] = useState(40);
  const [totalTime, setTotalTime] = useState(0);
  const [estimatedCalories, setEstimatedCalories] = useState(0);

  useEffect(() => {
    // คำนวณเวลาทั้งหมดและแคลอรี่โดยประมาณ
    const totalJumpTime = totalSets * jumpDuration;
    const totalRestTime = (totalSets - 1) * restTime;
    const newTotalTime = totalJumpTime + totalRestTime;
    setTotalTime(newTotalTime);

    // คำนวณแคลอรี่โดยประมาณ (8.67 แคลอรี่ต่อนาทีของการกระโดดเชือก)
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
        // จบช่วงพัก เริ่มออกกำลังกาย
        setIsResting(false);
        setTime(jumpDuration);
        // เล่นเสียงเริ่มการกระโดด
        playSound("start");
      } else {
        setSets((sets) => sets + 1);
        if (sets + 1 >= totalSets) {
          // จบการออกกำลังกายทั้งหมด
          setIsActive(false);
          setIsResting(false);
          // เล่นเสียงเมื่อจบการออกกำลังกายทั้งหมด
          playFinishWorkout();
        } else {
          // จบเซ็ทหนึ่ง เข้าสู่ช่วงพัก
          setIsResting(true);
          setTime(restTime);
          // เล่นเสียงเมื่อจบเซ็ทหนึ่ง
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
      // เล่นเสียงนับถอยหลัง 3-2-1 ก่อนเริ่ม
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {isResting ? "เวลาพัก" : "กระโดดเชือก"}
        </h1>
        <div className="text-6xl font-bold text-center mb-6">
          {Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}
          {time % 60}
        </div>
        <div className="flex space-x-2 mb-4">
          <Button onClick={toggleTimer} className="flex-1">
            {isActive ? "หยุด" : "เริ่ม"}
          </Button>
          <Button onClick={resetTimer} className="flex-1">
            รีเซ็ต
          </Button>
        </div>
        <div className="mb-4">
          <Label htmlFor="jumpDuration" className="block mb-2">
            เวลากระโดด (วินาที):
          </Label>
          <Input
            id="jumpDuration"
            type="number"
            value={jumpDuration}
            onChange={handleJumpDurationChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="restTime" className="block mb-2">
            เวลาพัก (วินาที):
          </Label>
          <Input
            id="restTime"
            type="number"
            value={restTime}
            onChange={handleRestTimeChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="totalSets" className="block mb-2">
            จำนวนเซ็ททั้งหมด:
          </Label>
          <Input
            id="totalSets"
            type="number"
            value={totalSets}
            onChange={handleTotalSetsChange}
            className="w-full"
          />
        </div>
        <div className="text-center mb-4">
          <p>
            เซ็ตที่ทำแล้ว: {sets} / {totalSets}
          </p>
          <p>แคลอรี่ที่คาดว่าจะเผาผลาญ: {estimatedCalories} kcal</p>
          <p>
            เวลาทั้งหมด: {Math.floor(totalTime / 60)} นาที {totalTime % 60}{" "}
            วินาที
          </p>
        </div>
        <p className="text-sm text-gray-600 text-center">
          {isResting
            ? "กำลังพัก... เตรียมตัวกระโดดเชือกรอบต่อไป!"
            : "กำลังกระโดดเชือก... สู้ๆ!"}
        </p>
      </div>
    </div>
  );
}
