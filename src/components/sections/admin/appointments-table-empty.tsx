import { Calendar } from "lucide-react";

export function AppointmentsTableEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Calendar className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-muted-foreground mb-2 text-lg font-medium">
        هیچ نوبتی یافت نشد
      </h3>
      <p className="text-muted-foreground/80 text-center text-sm">
        با فیلترهای فعلی هیچ نوبتی وجود ندارد. لطفاً فیلترها را تغییر دهید یا
        بعداً دوباره تلاش کنید.
      </p>
    </div>
  );
}

