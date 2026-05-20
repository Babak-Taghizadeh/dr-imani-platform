"use client";
import { Card } from "@/components/ui/card";
import {
  calculatePrice,
  PRICE_UNDER_10,
  PRICE_OVER_10,
} from "@/lib/price-calculator";
import { cn } from "@/lib/utils";
import { toPersianNumber } from "@/lib/persian-number-utils";

interface AgeRangeSelectorProps {
  value?: "UNDER_15" | "OVER_15";
  onChange: (value: "UNDER_15" | "OVER_15") => void;
}

export function AgeRangeSelector({ value, onChange }: AgeRangeSelectorProps) {
  const adultPrice = PRICE_OVER_10 / 10;
  const childPrice = PRICE_UNDER_10 / 10;
  const selectedPrice = calculatePrice(value!) / 10;
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row">
        <Card
          className={cn(
            "hover:border-primary flex-1 cursor-pointer transition-all",
            value === "UNDER_15" && "border-primary bg-primary/5",
          )}
          onClick={() => onChange("UNDER_15")}
        >
          <div className="text-center md:p-6">
            <h3 className="font-semibold">زیر {toPersianNumber(10)} سال</h3>
            <p className="text-primary mt-2 text-lg font-bold md:text-2xl">
              {childPrice.toLocaleString("fa-IR")} تومان
            </p>
          </div>
        </Card>
        <Card
          className={cn(
            "hover:border-primary flex-1 cursor-pointer transition-all",
            value === "OVER_15" && "border-primary bg-primary/5",
          )}
          onClick={() => onChange("OVER_15")}
        >
          <div className="text-center md:p-6">
            <h3 className="font-semibold">بالای {toPersianNumber(10)} سال</h3>
            <p className="text-primary mt-2 text-lg font-bold md:text-2xl">
              {adultPrice.toLocaleString("fa-IR")} تومان
            </p>
          </div>
        </Card>
      </div>
      {value && (
        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-accent-foreground text-sm">مبلغ قابل پرداخت:</p>
          <p className="text-primary mt-1 text-xl font-bold md:text-2xl">
            {selectedPrice.toLocaleString("fa-IR")} تومان
          </p>
        </div>
      )}
    </div>
  );
}
