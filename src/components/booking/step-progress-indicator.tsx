import {
  Calendar,
  Users,
  CalendarDays,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5;

interface StepProgressIndicatorProps {
  currentStep: Step;
}

const steps: Array<{
  number: Step;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { number: 1, label: "نوع نوبت", icon: Calendar },
  { number: 2, label: "گروه سنی", icon: Users },
  { number: 3, label: "تاریخ", icon: CalendarDays },
  { number: 4, label: "زمان", icon: Clock },
  { number: 5, label: "تأیید", icon: CheckCircle },
];

export function StepProgressIndicator({
  currentStep,
}: StepProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.number}
                className={cn("flex items-center", !isLast && "flex-1")}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-primary/50 shadow-lg"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-background text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium transition-colors",
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1 transition-colors duration-300",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/30",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.number}
                className={cn("flex items-center", !isLast && "flex-1")}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-primary/50 shadow-lg"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-background text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-1 text-[10px] font-medium transition-colors",
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "mx-1 h-0.5 flex-1 transition-colors duration-300",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/30",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
