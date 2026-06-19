import { TOTAL_STAGES } from "../config";

export default function HUD({
  score,
  combo,
  timeLeft,
  stage,
}: {
  score: number;
  combo: number;
  timeLeft: number;
  stage: number;
}) {
  const multiplierLabel = combo >= 10 ? "×2.0" : combo >= 5 ? "×1.5" : "×1.0";
  const timeValClass =
    timeLeft <= 10
      ? "text-miss animate-pulse-dim"
      : timeLeft <= 20
        ? "text-good"
        : "text-gold";

  return (
    <div className="flex justify-between bg-ocean border border-rim rounded-lg px-5 py-2.5">
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[0.65rem] text-muted uppercase tracking-widest">
          得分
        </span>
        <span className="text-[1.4rem] font-bold text-gold leading-[1.2]">
          {score.toLocaleString("zh-TW")}
        </span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[0.65rem] text-muted uppercase tracking-widest">
          Combo
        </span>
        <span className="text-[1.4rem] font-bold text-gold leading-[1.2]">
          {combo}{" "}
          <small className="text-[0.7rem] opacity-80">{multiplierLabel}</small>
        </span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[0.65rem] text-muted uppercase tracking-widest">
          關卡
        </span>
        <span className="text-[1.4rem] font-bold text-gold leading-[1.2]">
          {stage}
          <small className="text-[0.7rem] opacity-80"> / {TOTAL_STAGES}</small>
        </span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[0.65rem] text-muted uppercase tracking-widest">
          時間
        </span>
        <span className={`text-[1.4rem] font-bold leading-[1.2] ${timeValClass}`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}
