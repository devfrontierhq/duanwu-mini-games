// Set VITE_SHEETS_URL in .env.local to enable leaderboard

export const TZ = "Asia/Taipei";

export const SHEETS_URL: string =
  (import.meta.env.VITE_SHEETS_URL as string) ?? "";

export const REGISTER_URL =
  "https://devfrontier.oen.tw/events/3E1rFTJrJbsuVByUhDzW1fZ45Mz";

export const FB_PAGE_URL = "https://www.facebook.com/devfrontierhq/";

export const STAGES = [
  { name: '平靜河道', timeLimit: 90, barSpeedMult: 1.0, seqOffset: 0 },
  { name: '風浪挑戰', timeLimit: 75, barSpeedMult: 0.75, seqOffset: 1 },
  { name: '急流衝刺', timeLimit: 60, barSpeedMult: 0.55, seqOffset: 2 },
] as const;
export const TOTAL_STAGES = STAGES.length;

// Timing bar: left→right, time-based (no bounce)
export const BAR_DURATION_START = 2400; // ms on round 1
export const BAR_DURATION_MIN = 1000; // ms floor
export const BAR_DURATION_DEC = 50; // ms shaved per round

export const SCORE: Record<string, number> = {
  perfect: 1000,
  good: 500,
  miss: 0,
};
export const BOAT_DELTA: Record<string, number> = {
  perfect: 10,
  good: 5,
  miss: 0,
};

// Background drift: boat slowly moves forward during active play
export const DRIFT_AMOUNT = 0.06; // % per tick
export const DRIFT_INTERVAL = 150; // ms
