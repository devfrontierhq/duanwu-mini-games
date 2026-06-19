export default function RiverTrack({
  progress,
  driftPaused,
}: {
  progress: number;
  driftPaused: boolean;
}) {
  const pct = Math.min(progress, 100);
  const boatLeft = `calc(${pct}% - ${(pct / 100) * 44}px)`;

  return (
    <div className="bg-[#0a2240] border border-[#1a4a7a] rounded-lg px-3.5 pt-3 pb-2 relative overflow-hidden">
      <div className="flex justify-between text-[0.7rem] text-muted mb-1.5">
        <span>🚣 出發</span>
        <span>🏁 終點</span>
      </div>
      <div className="relative h-11 bg-[linear-gradient(90deg,#0a3060,#1a5090,#0a3060)] rounded-[22px] border-2 border-[#2a6aaa] overflow-visible mb-1.5">
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,#0e5c1a,#2ecc71)] rounded-[22px] transition-[width] duration-350 ease-out pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <div
          className={`absolute -top-2.5 text-[2.2rem] transition-[left] duration-350 ease-out select-none pointer-events-none ${driftPaused ? "river-boat-frozen" : ""}`}
          style={{
            left: boatLeft,
            filter: driftPaused
              ? undefined
              : "drop-shadow(0 3px 6px rgba(0,0,0,0.6))",
          }}
        >
          🛶
          {driftPaused && <span className="boat-frozen-icon">🌀</span>}
        </div>
        <div className="absolute right-2 -top-3.5 text-[1.8rem] select-none">
          🏁
        </div>
      </div>
      <div className="river-wave" />
    </div>
  );
}
