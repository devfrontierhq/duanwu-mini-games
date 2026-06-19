// Set VITE_SHEETS_URL in .env.local to enable leaderboard
export const SHEETS_URL: string =
  (import.meta.env.VITE_SHEETS_URL as string) ?? "";

export const REGISTER_URL =
  "https://devfrontier.oen.tw/events/3E1rFTJrJbsuVByUhDzW1fZ45Mz";

export const FB_PAGE_URL = "https://www.facebook.com/devfrontierhq/";

export const GAME_DURATION = 90; // seconds

// Timing bar: left→right, time-based (no bounce)
export const BAR_DURATION_START = 2400; // ms on round 1
export const BAR_DURATION_MIN = 1200; // ms floor
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
