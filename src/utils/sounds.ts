// เก็บ Audio objects ที่โหลดแล้วเพื่อใช้ซ้ำ
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * เล่นไฟล์เสียง
 * @param sound ชื่อไฟล์เสียง (ไม่รวมส่วนขยาย)
 * @param volume ระดับเสียง (0.0 ถึง 1.0)
 */
export const playSound = (sound: string, volume = 1.0): void => {
  // ตรวจสอบว่าสามารถเล่นเสียงได้ไหม
  if (!window.Audio) return;

  // ใช้เสียงจากแคชถ้ามี
  if (!audioCache[sound]) {
    // ใช้ import.meta.env.BASE_URL เพื่อรับ base path ที่ถูกต้อง
    const basePath = import.meta.env.BASE_URL || "/";
    audioCache[sound] = new Audio(`${basePath}sounds/${sound}.mp3`);
  }

  const audio = audioCache[sound];

  // รีเซ็ตเสียงเพื่อให้เล่นใหม่ได้
  audio.currentTime = 0;
  audio.volume = volume;

  // เล่นเสียง
  audio.play().catch((error) => {
    console.error(`Error playing sound: ${sound}`, error);
  });
};

// สำหรับนับถอยหลัง 3-2-1
export const playCountdown = async (): Promise<void> => {
  return new Promise((resolve) => {
    let count = 3;

    const interval = setInterval(() => {
      // เล่นเสียงบี๊บสั้นๆ
      playSound("beep", 0.5);

      count--;
      if (count <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          // เล่นเสียงเริ่มต้น
          playSound("start");
          resolve();
        }, 1000);
      }
    }, 1000);
  });
};

// เสียงเมื่อจบเซตหนึ่ง
export const playFinishSet = (): void => {
  playSound("beep");
};

// เสียงเมื่อเสร็จสิ้นการออกกำลังกาย
export const playFinishWorkout = (): void => {
  playSound("finish");
};
