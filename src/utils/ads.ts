import { isBefore } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { TZ } from "../config";

export type AdType = "event" | "fb";

// Switch to fb after 2026-06-27 00:00:00 (Taiwan time).
const SWITCH_DATE = new Date("2026-06-27T00:00:00+08:00");

export function getAdType(): AdType {
  const now = toZonedTime(new Date(), TZ);
  return isBefore(now, SWITCH_DATE) ? "event" : "fb";
}
