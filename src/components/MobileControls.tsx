import type { useGame } from "../hooks/useGame";
import type { Arrow } from "../types";

export default function MobileControls({
  game,
}: {
  game: ReturnType<typeof useGame>;
}) {
  const { sequenceDone, paused } = game.state;

  const arrowBtn = (arrow: Arrow) => (
    <button
      key={arrow}
      className="w-14 h-14 bg-panel border-2 border-rim rounded-xl text-2xl select-none touch-manipulation transition-transform active:scale-90 active:bg-rim"
      onPointerDown={(e) => {
        e.preventDefault();
        game.handleArrow(arrow);
      }}
    >
      {arrow}
    </button>
  );

  return (
    <div className="flex md:hidden items-center justify-between pt-1 gap-4">
      {/* D-pad — ⏸ sits in the centre cell */}
      <div className="grid grid-cols-3 gap-1.5">
        <div />
        {arrowBtn("↑")}
        <div />
        {arrowBtn("←")}
        <button
          className="w-10 h-10 self-center justify-self-center bg-panel border border-rim rounded-lg text-muted text-sm select-none touch-manipulation active:bg-rim"
          onPointerDown={(e) => {
            e.preventDefault();
            game.togglePause();
          }}
        >
          {paused ? "▶" : "⏸"}
        </button>
        {arrowBtn("→")}
        <div />
        {arrowBtn("↓")}
        <div />
      </div>

      {/* Hit button */}
      <button
        className={`w-24 h-24 rounded-full border-4 text-base font-bold leading-snug select-none touch-manipulation transition-[transform,box-shadow] active:scale-90 ${
          sequenceDone
            ? "border-gold bg-linear-to-br from-dragon to-[#8b0000] text-gold animate-pulse-dim shadow-[0_0_20px_rgba(232,184,75,0.4)]"
            : "border-rim bg-panel text-muted opacity-40"
        }`}
        onPointerDown={(e) => {
          e.preventDefault();
          game.handleSpace();
        }}
      >
        ⚡<br />
        划槳！
      </button>
    </div>
  );
}
