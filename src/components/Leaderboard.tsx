import { useState, useEffect } from "react";
import { SHEETS_URL } from "../config";
import type { ScoreEntry } from "../types";
import { fetchTopScores } from "../utils/leaderboard";

export default function Leaderboard({
  limit = 10,
  refresh = 0,
}: {
  limit?: number;
  refresh?: number;
}) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopScores(limit)
      .then(setScores)
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [limit, refresh]);

  if (!SHEETS_URL)
    return (
      <p className="text-center text-muted text-[0.82rem] py-3">
        排行榜尚未設定
      </p>
    );
  if (loading)
    return (
      <p className="text-center text-muted text-[0.82rem] py-3">載入中…</p>
    );
  if (!scores.length)
    return (
      <p className="text-center text-muted text-[0.82rem] py-3">
        尚無記錄，搶佔第一名！
      </p>
    );

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <table className="w-full border-collapse text-[0.88rem]">
      <tbody>
        {scores.map((entry, i) => (
          <tr key={i} className={`lb-row-${Math.min(i + 1, 4)}`}>
            <td className="lb-rank">{medals[i] ?? i + 1}</td>
            <td className="lb-name">{entry.name}</td>
            <td className="lb-score">{entry.score.toLocaleString("zh-TW")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
