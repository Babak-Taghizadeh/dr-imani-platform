"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Disabled dates admin error:", error);
  }, [error]);

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">
            خطا در بارگذاری داده‌ها
          </p>
          {error instanceof Error && error.message && (
            <p className="text-muted-foreground mt-2 text-sm">
              {error.message}
            </p>
          )}
          <Button
            onClick={reset}
            variant="outline"
            className="mt-4"
            size="sm"
          >
            <RefreshCw className="ml-2 h-4 w-4" />
            تلاش مجدد
          </Button>
        </div>
      </div>
    </div>
  );
}

