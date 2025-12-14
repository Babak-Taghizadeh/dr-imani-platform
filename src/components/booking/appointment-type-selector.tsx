"use client";

import { Button } from "@/components/ui/button";
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
    <div className="grid grid-cols-2 gap-4">
      <Card
        className={cn(
          "cursor-pointer transition-all hover:border-primary",
          value === "ONLINE_PHONE" && "border-primary bg-primary/5",
        )}
        onClick={() => onChange("ONLINE_PHONE")}
      >
        <div className="p-6 text-center">
          <Phone className="mx-auto mb-2 h-8 w-8" />
          <h3 className="font-semibold">تماس تلفنی</h3>
          <p className="text-sm text-muted-foreground mt-1">
            مشاوره آنلاین از طریق تماس
          </p>
        </div>
      </Card>
      <Card
        className={cn(
          "cursor-pointer transition-all hover:border-primary",
          value === "IN_CLINIC" && "border-primary bg-primary/5",
        )}
        onClick={() => onChange("IN_CLINIC")}
      >
        <div className="p-6 text-center">
          <Building2 className="mx-auto mb-2 h-8 w-8" />
          <h3 className="font-semibold">حضوری</h3>
          <p className="text-sm text-muted-foreground mt-1">
            مراجعه به مطب
          </p>
        </div>
      </Card>
    </div>
  );
}

