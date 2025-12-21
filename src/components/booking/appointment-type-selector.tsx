"use client";
import { Card } from "@/components/ui/card";
import { Phone, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentTypeSelectorProps {
  value?: "ONLINE_PHONE" | "IN_CLINIC";
  onChange: (value: "ONLINE_PHONE" | "IN_CLINIC") => void;
}

export function AppointmentTypeSelector({
  value,
  onChange,
}: AppointmentTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card
        className={cn(
          "hover:border-primary flex-1 cursor-pointer transition-all",
          value === "ONLINE_PHONE" && "border-primary bg-primary/5",
        )}
        onClick={() => onChange("ONLINE_PHONE")}
      >
        <div className="text-center md:p-6">
          <Phone className="mx-auto mb-2 h-8 w-8" />
          <h3 className="font-semibold">تماس تلفنی</h3>
          <p className="text-accent-foreground mt-1 text-sm">
            مشاوره آنلاین از طریق تماس
          </p>
        </div>
      </Card>
      <Card
        className={cn(
          "hover:border-primary flex-1 cursor-pointer transition-all",
          value === "IN_CLINIC" && "border-primary bg-primary/5",
        )}
        onClick={() => onChange("IN_CLINIC")}
      >
        <div className="text-center md:p-6">
          <Building2 className="mx-auto mb-2 h-8 w-8" />
          <h3 className="font-semibold">حضوری</h3>
          <p className="text-accent-foreground mt-1 text-sm">مراجعه به مطب</p>
        </div>
      </Card>
    </div>
  );
}
