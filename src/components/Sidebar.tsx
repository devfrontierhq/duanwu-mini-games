import AdCard from "./AdCard";
import Leaderboard from "./Leaderboard";

export default function Sidebar() {
  return (
    <aside className="w-65 shrink-0 flex flex-col gap-3.5 max-md:w-full max-md:flex-row max-md:flex-wrap">
      <div className="max-md:flex-1 max-md:min-w-50">
        <AdCard />
      </div>
      <div className="bg-panel border border-rim rounded-[10px] p-3.5 max-md:flex-1 max-md:min-w-50">
        <h3 className="text-[0.85rem] text-gold mb-2.5 text-center">
          🏆 排行榜
        </h3>
        <Leaderboard limit={5} />
      </div>
    </aside>
  );
}
