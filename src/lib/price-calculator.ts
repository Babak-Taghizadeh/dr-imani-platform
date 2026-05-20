export const PRICE_UNDER_10 = parseInt(process.env.PRICE_UNDER_10 || "8400000");
export const PRICE_OVER_10 = parseInt(process.env.PRICE_OVER_10 || "7800000");

export type AgeRange = "UNDER_15" | "OVER_15";

export function calculatePrice(ageRange: AgeRange): number {
  return ageRange === "UNDER_15" ? PRICE_UNDER_10 : PRICE_OVER_10;
}
