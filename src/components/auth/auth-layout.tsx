import { ReactNode } from "react";
import {
  Lock,
  User,
  Moon,
  Shield,
  Stethoscope,
  Activity,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  className,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-[85dvh] items-center justify-center overflow-hidden bg-blue-50 p-4">
      <div className="pointer-events-none absolute inset-0">
        <Moon className="text-primary/10 absolute top-8 left-8 h-12 w-12 md:left-24 md:h-16 md:w-16" />

        <Stethoscope className="text-primary/10 absolute top-8 right-8 h-10 w-10 md:right-24 md:h-14 md:w-14" />

        <Lock className="text-primary/10 absolute top-1/2 left-1/6 h-8 w-8 -translate-y-1/2 md:h-12 md:w-12" />

        <Activity className="text-primary/10 absolute top-1/2 right-1/6 h-9 w-9 -translate-y-1/2 md:h-12 md:w-12" />

        <Building className="text-primary/10 absolute bottom-10 left-10 h-10 w-10 md:h-14 md:w-14" />

        <Shield className="text-primary/10 absolute right-8 bottom-8 h-11 w-11 md:h-14 md:w-14" />

        <User className="text-primary/10 absolute top-12 left-1/2 h-9 w-9 -translate-x-1/2 md:h-12 md:w-12" />
      </div>

      <div
        className={cn(
          "relative z-10 w-full max-w-[420px] space-y-8",
          "border-border bg-card rounded-lg border p-6 shadow-sm",
          "md:p-8",
          className,
        )}
      >
        {/* Header */}
        <div className="space-y-2 text-center">
          <h2 className="text-foreground text-lg font-bold md:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="text-accent-foreground text-sm">{description}</p>
          )}
        </div>

        {/* Form Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
