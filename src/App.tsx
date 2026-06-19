import { useEffect } from "react";
import { useGame } from "./hooks/useGame";
import StartScreen from "./components/StartScreen";
import GameOverScreen from "./components/GameOverScreen";
import GameScreen from "./components/GameScreen";
import Sidebar from "./components/Sidebar";
import { gtm } from "./utils/gtm";

export default function App() {
  const game = useGame();
  const { phase, score, maxCombo, isWin } = game.state;
  const isPlaying = phase === "playing" || phase === "feedback" || phase === "stageclear";

  useEffect(() => {
    if (phase === "gameover") gtm.gameOver(score, maxCombo, isWin);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col min-h-screen ">
      <header className="bg-[linear-gradient(90deg,#6b0000,#c0392b,#6b0000)] border-b-[3px] border-gold text-center py-2.5 px-5 shrink-0">
        <h1 className="text-[clamp(1.2rem,3vw,1.8rem)] text-gold tracking-[0.08em] font-bold">
          🐉 端午節划龍舟競速
        </h1>
      </header>
      <div className="flex gap-4 p-4 max-w-285 w-full mx-auto items-start flex-1 max-md:flex-col max-md:p-2.5">
        <main className="flex-1 min-w-0 w-full">
          {phase === "start" && <StartScreen onStart={game.start} />}
          {isPlaying && <GameScreen game={game} />}
          {phase === "gameover" && (
            <GameOverScreen game={game} onReset={game.reset} />
          )}
        </main>
        {phase !== "gameover" && <Sidebar />}
      </div>
    </div>
  );
}
