import type { useGame } from "../hooks/useGame";
import HUD from "./HUD";
import MobileControls from "./MobileControls";
import RiverTrack from "./RiverTrack";
import { STAGES } from "../config";
import { gtm } from "../utils/gtm";

export default function GameScreen({
  game,
}: {
  game: ReturnType<typeof useGame>;
}) {
  const { state, indicatorRef, barRef } = game;
  const {
    score,
    combo,
    timeLeft,
    boatProgress,
    driftPaused,
    paused,
    phase,
    stage,
    sequence,
    inputIndex,
    sequenceDone,
    wrongKey,
    feedbackType,
    feedbackPoints,
  } = state;

  const feedbackText =
    feedbackType === "perfect"
      ? "🎯 PERFECT!"
      : feedbackType === "good"
        ? "✅ GOOD!"
        : feedbackType === "miss"
          ? "❌ MISS!"
          : "";

  return (
    <div className="relative bg-panel border border-rim rounded-xl p-4 flex flex-col gap-3.5">
      {paused && (
        <div className="absolute inset-0 bg-ocean/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-xl z-10">
          <p className="text-2xl font-bold text-gold">⏸ 暫停</p>
          <p className="text-sm text-muted">按 ESC 繼續遊戲</p>
          <div className="flex gap-3 mt-1">
            <button
              className="px-6 py-2.5 bg-linear-to-br from-dragon to-[#8b0000] text-gold border-2 border-gold rounded-lg font-bold cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
              onClick={() => { gtm.pauseResume(); game.togglePause(); }}
            >
              ▶ 繼續
            </button>
            <button
              className="px-6 py-2.5 bg-panel text-cream border-2 border-rim rounded-lg font-bold cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
              onClick={() => { gtm.pauseRestart(); game.reset(); }}
            >
              ↺ 重新開始
            </button>
            <button
              className="px-6 py-2.5 bg-panel text-cream border-2 border-rim rounded-lg font-bold cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
              onClick={game.settle}
            >
              📊 提前結算
            </button>
          </div>
        </div>
      )}
      {phase === "stageclear" && (
        <div className="absolute inset-0 bg-ocean/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-xl z-10">
          <p className="text-5xl">🏅</p>
          <p className="text-2xl font-bold text-gold">第 {stage} 關完成！</p>
          <p className="text-[0.9rem] text-muted">
            下一關：{STAGES[stage].name}
          </p>
          <div className="flex gap-3 mt-1">
            <button
              className="px-6 py-2.5 bg-panel text-cream border-2 border-rim rounded-lg font-bold cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
              onClick={game.settle}
            >
              📊 結算
            </button>
            <button
              className="px-6 py-2.5 bg-linear-to-br from-dragon to-[#8b0000] text-gold border-2 border-gold rounded-lg font-bold cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
              onClick={game.nextStage}
            >
              ▶ 下一關
            </button>
          </div>
        </div>
      )}
      <HUD score={score} combo={combo} timeLeft={timeLeft} stage={stage} />
      <RiverTrack progress={boatProgress} driftPaused={driftPaused} />

      {/* Sequence box */}
      <div className="bg-ocean border border-rim rounded-lg p-4 text-center">
        <p className="text-[0.7rem] text-muted uppercase tracking-[0.12em] mb-3">
          依序按下方向鍵
        </p>
        <div className="flex justify-center gap-2.5 flex-wrap">
          {sequence.map((arrow, i) => {
            let cls = "key-card";
            if (i < inputIndex) cls += " done";
            else if (i === inputIndex && wrongKey) cls += " wrong";
            else if (i === inputIndex && !sequenceDone) cls += " current";
            else if (sequenceDone) cls += " done";
            else cls += " pending";
            return (
              <div key={i} className={cls}>
                {arrow}
              </div>
            );
          })}
        </div>
      </div>

      {/* Timing bar */}
      <div className="bg-ocean border-2 border-gold rounded-lg p-4 text-center">
        <p
          className={`text-[0.82rem] mb-2.5 ${sequenceDone ? "text-gold animate-pulse-dim" : "text-muted"}`}
        >
          {sequenceDone ? (
            <strong className="text-base">⚡ 按下空白鍵划槳！</strong>
          ) : (
            <>
              先完成方向鍵組合…{" "}
              <kbd className="bg-panel border border-rim rounded px-1.5 py-px text-[0.75rem] text-muted">
                SPACE
              </kbd>{" "}
              尚未解鎖
            </>
          )}
        </p>
        <div
          className={`relative h-10 bg-[#0a1628] border rounded-md overflow-hidden max-w-130 mx-auto transition-[border-color,box-shadow] duration-200 ${
            sequenceDone
              ? "border-gold shadow-[0_0_14px_rgba(232,184,75,0.35)]"
              : "border-rim"
          }`}
          ref={barRef}
        >
          <div className="tz tz-miss" style={{ left: 0, width: "40%" }} />
          <div className="tz tz-good" style={{ left: "40%", width: "25%" }} />
          <div
            className="tz tz-perfect"
            style={{ left: "65%", width: "20%" }}
          />
          <div className="tz tz-good" style={{ left: "85%", width: "10%" }} />
          <div className="tz tz-miss" style={{ left: "95%", width: "5%" }} />
          {!sequenceDone && <div className="timing-bar-lock" />}
          <div className="timing-indicator" ref={indicatorRef} />
        </div>
        <div className="flex max-w-130 mx-auto mt-1 text-[0.62rem] font-bold tracking-wider">
          <span
            className="text-center overflow-hidden text-miss"
            style={{ width: "40%" }}
          >
            MISS
          </span>
          <span
            className="text-center overflow-hidden text-good"
            style={{ width: "25%" }}
          >
            GOOD
          </span>
          <span
            className="text-center overflow-hidden text-perfect"
            style={{ width: "20%" }}
          >
            PERFECT
          </span>
          <span
            className="text-center overflow-hidden text-good"
            style={{ width: "10%" }}
          >
            GOOD
          </span>
          <span
            className="text-center overflow-hidden text-miss"
            style={{ width: "5%" }}
          >
            MISS
          </span>
        </div>
      </div>

      <div
        className={`text-center min-h-13 flex items-center justify-center text-[1.8rem] font-bold tracking-[0.04em] ${feedbackType ? `feedback-${feedbackType}` : ""}`}
      >
        {feedbackText && (
          <>
            {feedbackText}
            {feedbackPoints > 0 && (
              <span className="text-base opacity-85">
                {" "}
                +{feedbackPoints.toLocaleString("zh-TW")}
              </span>
            )}
          </>
        )}
      </div>

      <MobileControls game={game} />
    </div>
  );
}
