export const PRICE_UNDER_15 = parseInt(process.env.PRICE_UNDER_15 || "6500000");
export const PRICE_OVER_15 = parseInt(process.env.PRICE_OVER_15 || "4900000");

export type AgeRange = "UNDER_15" | "OVER_15";

export function calculatePrice(ageRange: AgeRange): number {
  return ageRange === "UNDER_15" ? PRICE_UNDER_15 : PRICE_OVER_15;
}
