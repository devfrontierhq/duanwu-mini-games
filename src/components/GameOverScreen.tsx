import { useState } from "react";
import type { useGame } from "../hooks/useGame";
import { submitScore } from "../utils/leaderboard";
import AdCard from "./AdCard";
import Leaderboard from "./Leaderboard";
import { gtm } from "../utils/gtm";

export default function GameOverScreen({
  game,
  onReset,
}: {
  game: ReturnType<typeof useGame>;
  onReset: () => void;
}) {
  const { score, maxCombo, boatProgress, isWin } = game.state;

  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [lbRefresh, setLbRefresh] = useState(0);

  async function handleSubmit() {
    if (!name.trim() || status !== "idle") return;
    setStatus("loading");
    try {
      await submitScore(name.trim(), score, maxCombo);
      gtm.scoreSubmit(score, maxCombo);
      setStatus("done");
      setLbRefresh((r) => r + 1);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-panel border border-rim rounded-xl overflow-hidden">
      <div className="text-center px-5 pt-7 pb-4 border-b border-rim">
        <h2 className="text-[1.8rem] text-gold mb-2.5">
          {isWin ? "🏆 抵達終點！" : "⛵ 遊戲結束！"}
        </h2>
        <div
          className="text-[3.5rem] font-bold text-white leading-[1.1]"
          style={{ textShadow: "0 0 24px rgba(232, 184, 75, 0.4)" }}
        >
          {score.toLocaleString("zh-TW")}
        </div>
        <p className="text-[0.85rem] text-muted mt-2">
          最高 Combo：{maxCombo}× ｜ 龍舟進度：{Math.round(boatProgress)}%
        </p>
      </div>

      <div className="flex gap-4 p-4 flex-wrap max-md:flex-col-reverse ">
        <div className="flex-1 min-w-60 flex flex-col gap-3.5">
          <AdCard large />
        </div>

        <div className="flex-1 min-w-60 flex flex-col gap-3.5">
          <div className="bg-ocean border border-rim rounded-lg p-4">
            <h3 className="text-[0.9rem] text-gold mb-3 pb-2 border-b border-rim">
              🏆 上傳成績
            </h3>
            {status !== "done" ? (
              <>
                <p className="text-[0.82rem] text-muted mb-2.5">
                  輸入名字加入排行榜！
                </p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-[#142038] border border-rim rounded-md px-3 py-2.25 text-cream text-[0.95rem] outline-none transition-[border-color] duration-150 focus:border-gold"
                    type="text"
                    placeholder="你的名字…"
                    maxLength={20}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <button
                    className="px-4 py-2.25 bg-linear-to-br from-dragon to-[#8b0000] text-gold border-2 border-gold rounded-lg text-[0.9rem] font-bold cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(192,57,43,0.45)] active:translate-y-0 disabled:opacity-50 disabled:cursor-default disabled:translate-y-0 disabled:shadow-none"
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "…" : "送出"}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-[0.8rem] text-miss mt-2">
                    上傳失敗，請稍後再試
                  </p>
                )}
              </>
            ) : (
              <p className="text-[0.8rem] text-perfect mt-2">✅ 成績已上傳！</p>
            )}
          </div>

          <div className="bg-ocean border border-rim rounded-lg p-4">
            <h3 className="text-[0.9rem] text-gold mb-3 pb-2 border-b border-rim">
              📊 排行榜 Top 10
            </h3>
            <Leaderboard limit={10} refresh={lbRefresh} />
          </div>
        </div>
      </div>

      <div className="text-center p-4 border-t border-rim">
        <button
          className="mt-1 inline-block px-9 py-3.25 bg-linear-to-br from-dragon to-[#8b0000] text-gold border-2 border-gold rounded-lg text-[1.1rem] font-bold cursor-pointer tracking-[0.04em] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(192,57,43,0.45)] active:translate-y-0"
          onClick={() => { gtm.playAgain(); onReset(); }}
        >
          🔄 再玩一次
        </button>
      </div>
    </div>
  );
}
