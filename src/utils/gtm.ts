declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: string, params?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export const gtm = {
  gameStart: () => push("game_start"),
  gameOver: (score: number, maxCombo: number, isWin: boolean) =>
    push("game_over", { score, max_combo: maxCombo, is_win: isWin }),
  scoreSubmit: (score: number, maxCombo: number) =>
    push("score_submit", { score, max_combo: maxCombo }),
  adClick: (adType: "fb" | "event", label: "follow_fb" | "register") =>
    push("ad_click", { ad_type: adType, label }),
  playAgain: () => push("play_again"),
  pauseResume: () => push("pause_resume"),
  pauseRestart: () => push("pause_restart"),
};
