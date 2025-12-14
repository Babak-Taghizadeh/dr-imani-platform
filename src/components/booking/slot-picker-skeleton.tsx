import { Skeleton } from "@/components/ui/skeleton";

export function SlotPickerSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
