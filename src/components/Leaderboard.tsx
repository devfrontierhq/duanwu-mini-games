import { useState, useEffect } from "react";
import { isSameDay, isSameMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { SHEETS_URL, TZ } from "../config";
import type { ScoreEntry } from "../types";
import { fetchTopScores, type ScorePeriod } from "../utils/leaderboard";

const TABS: { label: string; period: ScorePeriod }[] = [
  { label: "全部", period: "all" },
  { label: "本月", period: "month" },
  { label: "今日", period: "today" },
];

function inPeriod(dateStr: string, period: ScorePeriod): boolean {
  if (period === "all") return true;
  const tw = toZonedTime(new Date(dateStr), TZ);
  const now = toZonedTime(new Date(), TZ);
  if (period === "month") return isSameMonth(tw, now);
  return isSameDay(tw, now);
}

export default function Leaderboard({
  limit = 10,
  refresh = 0,
}: {
  limit?: number;
  refresh?: number;
}) {
  const [period, setPeriod] = useState<ScorePeriod>("all");
  const [all, setAll] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopScores(500)
      .then(setAll)
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, [refresh]);

  const scores = all.filter((e) => inPeriod(e.date, period)).slice(0, limit);

  if (!SHEETS_URL)
    return (
      <p className="text-center text-muted text-[0.82rem] py-3">
        排行榜尚未設定
      </p>
    );

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <div className="flex gap-1 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab.period}
            onClick={() => setPeriod(tab.period)}
            className={`px-3 py-1 rounded-md text-[0.78rem] font-bold transition-colors duration-150 cursor-pointer ${
              period === tab.period
                ? "bg-gold text-ocean"
                : "bg-panel border border-rim text-muted hover:text-cream"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-muted text-[0.82rem] py-3">載入中…</p>
      ) : !scores.length ? (
        <p className="text-center text-muted text-[0.82rem] py-3">
          尚無記錄，搶佔第一名！
        </p>
      ) : (
        <table className="w-full border-collapse text-[0.88rem]">
          <tbody>
            {scores.map((entry, i) => (
              <tr key={i} className={`lb-row-${Math.min(i + 1, 4)}`}>
                <td className="lb-rank">{medals[i] ?? i + 1}</td>
                <td className="lb-name">{entry.name}</td>
                <td className="lb-score">
                  {entry.score.toLocaleString("zh-TW")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
