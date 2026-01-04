import { BookingForm } from "@/components/sections/booking/booking-form";
import { BookingHero } from "@/components/sections/booking/booking-hero";

export default function BookingPage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      <BookingHero />
      <BookingForm />
    </div>
  );
}
