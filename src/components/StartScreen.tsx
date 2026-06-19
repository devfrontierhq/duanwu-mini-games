import { gtm } from "../utils/gtm";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-panel border border-rim rounded-xl text-center px-8 py-9">
      <div className="text-[4rem] mb-3">🛶</div>
      <h2 className="text-3xl text-gold mb-1.5">划龍舟競速</h2>
      <p className="text-[#7a9ac0] mb-6 text-[0.95rem]">
        節奏版 · 端午節限定 🐉
      </p>

      <div className="bg-white/4 border border-rim rounded-lg px-6 py-5 text-left max-w-120 mx-auto mb-7">
        <p className="text-gold font-bold mb-3">📖 遊戲規則</p>
        <ol className="pl-5 leading-loose text-[#c0d8f0] text-[0.9rem] list-decimal [&_strong]:text-gold">
          <li>
            每輪同時出現<strong>方向鍵組合</strong>與<strong>節奏條</strong>
          </li>
          <li>
            節奏條從左向右移動，<strong>到底就失敗</strong>！
          </li>
          <li>
            快速依序按下正確的<strong>方向鍵</strong>
          </li>
          <li>
            全部按完後，在桿子進入{" "}
            <strong style={{ color: "#2ecc71" }}>PERFECT</strong> 區時按下
            <strong>空白鍵</strong>
          </li>
          <li>越快完成組合 → 等待最佳時機 → 分數越高！</li>
          <li>
            在 <strong>90 秒</strong>內累積最高分衝排行榜！
          </li>
        </ol>
      </div>

      <button
        className="inline-block px-9 py-3.25 bg-linear-to-br from-dragon to-[#8b0000] text-gold border-2 border-gold rounded-lg text-[1.1rem] font-bold cursor-pointer tracking-[0.04em] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(192,57,43,0.45)] active:translate-y-0"
        onClick={() => { gtm.gameStart(); onStart(); }}
      >
        🚣 開始比賽！
      </button>
    </div>
  );
}
