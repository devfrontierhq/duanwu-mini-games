export type AdType = "event" | "fb";

export function getAdType(): AdType {
  const now = new Date();
  const tw = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
  const y = tw.getFullYear();
  const m = tw.getMonth(); // 0-indexed
  const d = tw.getDate();

  if (y < 2026 || m < 5) return "event";
  if (y > 2026 || m > 5) return "fb";
  return d <= 26 ? "event" : "fb";
}
