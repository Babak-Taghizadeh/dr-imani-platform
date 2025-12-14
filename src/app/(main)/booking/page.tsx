import { BookingForm } from "@/components/booking/booking-form";
import { BookingHero } from "@/components/booking/booking-hero";

export default function BookingPage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      <BookingHero />
      <BookingForm />
    </div>
  );
}
