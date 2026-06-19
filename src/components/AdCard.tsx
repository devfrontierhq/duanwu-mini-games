import { FB_PAGE_URL, REGISTER_URL } from "../config";
import { getAdType } from "../utils/ads";
import devfrontierLogo from "../assets/devfrontier-logo.svg";

export default function AdCard({ large = false }: { large?: boolean }) {
  const adType = getAdType();

  if (adType === "fb") {
    return (
      <div className="rounded-[10px] overflow-hidden bg-linear-to-br from-[#1877f2] to-[#0d56a6] border border-[#3b5998] p-4 text-center h-full flex flex-col items-center justify-center">
        <span className="text-[0.6rem] bg-white/12 border border-white/40 text-white/85 px-2 py-0.5 rounded-[10px] mb-2.5 tracking-[0.06em]">
          追蹤我們
        </span>
        <img
          src={devfrontierLogo}
          alt="DevFrontier"
          className="w-16 h-16 my-2.5 mx-auto"
        />
        <div className="text-[1.1rem] font-bold text-white mb-1.5">
          DevFrontier
        </div>
        <p className="text-[0.8rem] text-white/80 mb-3.5">
          AI 時代的 JavaScript 開發者社群
        </p>
        <a
          className="block text-center py-2.5 bg-white text-[#1877f2] no-underline rounded-md font-bold text-[0.9rem] transition-opacity duration-180 hover:opacity-80 w-full"
          href={FB_PAGE_URL}
          target="_blank"
          rel="noopener"
        >
          在 Facebook 追蹤 →
        </a>
      </div>
    );
  }

  return (
    <div
      className={`ad-event rounded-[10px] overflow-hidden bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-gold ${large ? "p-5" : "p-4"}`}
    >
      <span className="inline-block text-[0.6rem] bg-gold/15 border border-gold text-gold px-2 py-0.5 rounded-[10px] mb-2.5 tracking-[0.06em]">
        贊助活動
      </span>
      <p className="text-[0.75rem] text-[#8aaabf] mb-1">JSDC × DevFrontier</p>
      <h3
        className={`font-bold text-gold mb-1 ${large ? "text-[1.35rem]" : "text-[1.15rem]"}`}
      >
        6/27 小聚
      </h3>
      <p
        className={`ad-subtitle mb-3 ${large ? "text-[1.5rem]" : "text-[1.25rem]"}`}
      >
        AI Brain Fry 🧠🔥
      </p>
      <ul
        className={`list-none flex flex-col gap-1 mb-3.5 text-[#b0cce0] ${large ? "text-[0.92rem]" : "text-[0.82rem]"}`}
      >
        <li>📅 6/27 (六) 13:30 – 18:00</li>
        <li>📍 Mutix Studio · 台北松山</li>
        <li>🎤 Leo · Antonio · Vivian</li>
      </ul>
      <a
        className="block text-center py-2.5 bg-linear-to-r from-miss to-[#9b59b6] text-white no-underline rounded-md font-bold text-[0.9rem] transition-opacity duration-180 hover:opacity-80"
        href={REGISTER_URL}
        target="_blank"
        rel="noopener"
      >
        立即報名 →
      </a>
    </div>
  );
}
