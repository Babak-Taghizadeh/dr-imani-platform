import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header className="mb-8 space-y-4 text-right md:mb-12">
        <Skeleton className="h-12 w-3/4 md:h-16" />
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <span className="mx-2">•</span>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </header>

      <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-xl md:mb-12">
        <Skeleton className="absolute inset-0" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </article>
  );
};

export default Loading;
