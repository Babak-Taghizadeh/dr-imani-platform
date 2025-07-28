import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => {
  return (
    <div role="status" className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
};

export default TableSkeleton;
