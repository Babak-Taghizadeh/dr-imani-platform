import { Loader2 } from "lucide-react";
import { useState } from "react";

export const useBlockUI = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  const blockUI = async <T,>(promise: Promise<T>): Promise<T> => {
    setIsBlocked(true);
    try {
      return await promise;
    } finally {
      setIsBlocked(false);
    }
  };

  return {
    isBlocked,
    blockUI,
    BlockUI: ({ children }: { children: React.ReactNode }) => (
      <>
        {isBlocked && (
          <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <span className="text-muted-foreground text-sm animate-pulse">
                در حال پردازش...
              </span>
            </div>
          </div>
        )}
        <div className={isBlocked ? "pointer-events-none opacity-50" : ""}>
          {children}
        </div>
      </>
    ),
  };
};
