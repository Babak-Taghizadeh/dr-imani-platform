"use client";
import { Card } from "@/components/ui/card";
import {
  calculatePrice,
  PRICE_UNDER_15,
  PRICE_OVER_15,
} from "@/lib/price-calculator";
import { cn } from "@/lib/utils";
import { toPersianNumber } from "@/lib/persian-number-utils";

interface AgeRangeSelectorProps {
  value?: "UNDER_15" | "OVER_15";
  onChange: (value: "UNDER_15" | "OVER_15") => void;
}

export function AgeRangeSelector({ value, onChange }: AgeRangeSelectorProps) {
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
            <h3 className="font-semibold">زیر {toPersianNumber(15)} سال</h3>
            <p className="text-primary mt-2 text-lg font-bold md:text-2xl">
              {PRICE_UNDER_15.toLocaleString("fa-IR")} تومان
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
            <h3 className="font-semibold">بالای {toPersianNumber(15)} سال</h3>
            <p className="text-primary mt-2 text-lg font-bold md:text-2xl">
              {PRICE_OVER_15.toLocaleString("fa-IR")} تومان
            </p>
          </div>
        </Card>
      </div>
      {value && (
        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-accent-foreground text-sm">مبلغ قابل پرداخت:</p>
          <p className="text-primary mt-1 text-xl font-bold md:text-2xl">
            {calculatePrice(value).toLocaleString("fa-IR")} تومان
          </p>
        </div>
      )}
    </div>
  );
}
