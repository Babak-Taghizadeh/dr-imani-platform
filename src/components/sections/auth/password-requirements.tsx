"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRequirement {
  text: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export function PasswordRequirements({
  password,
  className,
}: PasswordRequirementsProps) {
  const requirements: PasswordRequirement[] = [
    {
      text: "حداقل ۶ کاراکتر",
      met: password.length >= 6,
    },
  ];

  if (password.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {requirements.map((req, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-2 text-xs",
            req.met ? "text-green-600" : "text-destructive",
          )}
        >
          {req.met ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <X className="text-destructive h-3.5 w-3.5" />
          )}
          <span>{req.text}</span>
        </div>
      ))}
    </div>
  );
}
