import { SHEETS_URL } from "../config";
import type { ScoreEntry } from "../types";

export async function fetchTopScores(limit = 10): Promise<ScoreEntry[]> {
  if (!SHEETS_URL) return [];
  const res = await fetch(`${SHEETS_URL}?action=getTop&limit=${limit}`, {
    cache: "no-store",
  });
  return res.json();
}

const SUBMIT_COOLDOWN_MS = 60_000;

function canSubmit(): boolean {
  const last = parseInt(localStorage.getItem("lastScoreSubmit") || "0");
  return Date.now() - last >= SUBMIT_COOLDOWN_MS;
}

export async function submitScore(
  name: string,
  score: number,
  maxCombo: number,
): Promise<void> {
  if (!SHEETS_URL) return;
  if (!canSubmit()) return;
  localStorage.setItem("lastScoreSubmit", String(Date.now()));
  await fetch(SHEETS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      score,
      maxCombo,
      date: new Date().toISOString(),
    }),
  });
}
