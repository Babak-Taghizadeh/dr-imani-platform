"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AppointmentTypeSelector } from "@/components/sections/booking/appointment-type-selector";
import { AgeRangeSelector } from "@/components/sections/booking/age-range-selector";
import { DatePicker } from "@/components/sections/booking/date-picker";
import { SlotPicker } from "@/components/sections/booking/slot-picker";
import { StepProgressIndicator } from "@/components/sections/booking/step-progress-indicator";
import { StepNavigation } from "@/components/sections/booking/step-navigation";
import { ConfirmationSummary } from "@/components/sections/booking/confirmation-summary";
import { bookingSchema, BookingFormData } from "@/lib/validation-schema";
import { toast } from "sonner";
import { Users, CalendarDays, Clock, Tag } from "lucide-react";
import { toShamsi } from "@/lib/shamsi-utils";

type Step = 1 | 2 | 3 | 4 | 5;

export function BookingForm() {
  const [step, setStep] = useState<Step>(1);
  const [slots, setSlots] = useState<
    Array<{ time: string; available: boolean }>
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [disabledDates, setDisabledDates] = useState<
    Array<{ startDate: string; endDate: string; reason?: string | null }>
  >([]);
  const [loadingDisabledDates, setLoadingDisabledDates] = useState(true);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      appointmentType: undefined,
      ageRange: undefined,
      date: "",
      time: "",
    },
    mode: "onChange",
  });

  // Fetch disabled dates from API
  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const res = await fetch("/api/appointments/disabled-dates");
        const data = await res.json();

        if (res.ok) {
          setDisabledDates(data.disabledDates || []);
        }
      } catch (error) {
        console.error("Error fetching disabled dates:", error);
      } finally {
        setLoadingDisabledDates(false);
      }
    };

    fetchDisabledDates();
  }, []);

  // Refetch slots when appointment type changes (if date is already selected)
  const appointmentType = form.watch("appointmentType");
  useEffect(() => {
    const date = form.getValues("date");

    if (appointmentType && date) {
      // Clear selected time when appointment type changes
      form.setValue("time", "");
      setLoadingSlots(true);

      const fetchSlots = async () => {
        try {
          const res = await fetch(
            `/api/appointments/availability?date=${date}&appointmentType=${appointmentType}`,
          );
          const data = await res.json();

          if (res.ok) {
            setSlots(data.slots || []);
          } else {
            toast.error(data.error || "خطا در دریافت زمان‌های موجود");
            setSlots([]);
          }
        } catch {
          toast.error("خطا در دریافت زمان‌های موجود");
          setSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };

      fetchSlots();
    } else if (appointmentType && !date) {
      // Clear slots if appointment type changes but no date is selected
      setSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentType]);

  const handleDateSelect = async (date: string) => {
    // Check if appointment type is selected
    const appointmentType = form.getValues("appointmentType");
    if (!appointmentType) {
      toast.error("لطفاً ابتدا نوع نوبت را انتخاب کنید");
      form.setValue("date", "");
      return;
    }

    // Check if date is disabled by admin (shouldn't happen since we filter them out, but safety check)
    const isDisabled = disabledDates.some((range) => {
      return date >= range.startDate && date <= range.endDate;
    });

    if (isDisabled) {
      toast.error("این تاریخ توسط مدیریت غیرفعال شده است");
      form.setValue("date", "");
      return;
    }

    form.setValue("date", date);
    form.setValue("time", "");
    setLoadingSlots(true);

    try {
      const res = await fetch(
        `/api/appointments/availability?date=${date}&appointmentType=${appointmentType}`,
      );
      const data = await res.json();

      if (res.ok) {
        setSlots(data.slots || []);
      } else {
        toast.error(data.error || "خطا در دریافت زمان‌های موجود");
      }
    } catch {
      toast.error("خطا در دریافت زمان‌های موجود");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await form.trigger("appointmentType");
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isValid = await form.trigger("ageRange");
      if (isValid) {
        setStep(3);
      }
    } else if (step === 3) {
      const date = form.getValues("date");
      // Check if selected date is disabled by admin
      const isDisabled = disabledDates.some((range) => {
        return date >= range.startDate && date <= range.endDate;
      });

      if (isDisabled) {
        toast.error("لطفاً تاریخ دیگری انتخاب کنید. این تاریخ غیرفعال است.");
        form.setValue("date", "");
        return;
      }

      const isValid = await form.trigger("date");
      if (isValid) {
        setStep(4);
      }
    } else if (step === 4) {
      const isValid = await form.trigger("time");
      if (isValid) {
        setStep(5);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const onSubmit = async (values: BookingFormData) => {
    try {
      // Create appointment
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ایجاد نوبت");
        return;
      }

      // Initiate payment
      const paymentRes = await fetch("/api/payments/sep/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: data.appointment.id,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.paymentUrl) {
        toast.error(paymentData.error || "خطا در اتصال به درگاه پرداخت");
        return;
      }

      // Redirect to payment gateway
      window.location.href = paymentData.paymentUrl;
    } catch {
      toast.error("خطایی در رزرو نوبت رخ داد");
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Form {...form}>
        {/* Step Progress Indicator */}
        <div className="mb-8">
          <StepProgressIndicator currentStep={step} />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Appointment Type */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className="min-h-[480px] space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 relative z-0 flex h-12 w-12 items-center justify-center rounded-full">
                  <Tag className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">
                  نوع نوبت را انتخاب کنید
                </h3>
              </div>
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AppointmentTypeSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {/* Step 2: Age Range */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className="min-h-[480px] space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">
                  گروه سنی را انتخاب کنید
                </h3>
              </div>
              <FormField
                control={form.control}
                name="ageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AgeRangeSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {/* Step 3: Date Selection */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className="flex min-h-[480px] flex-col space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 relative z-0 flex h-12 w-12 items-center justify-center rounded-full">
                  <CalendarDays className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">تاریخ را انتخاب کنید</h3>
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      {loadingDisabledDates ? (
                        <div className="flex min-h-[200px] items-center justify-center">
                          <p className="text-muted-foreground text-sm">
                            در حال بارگذاری...
                          </p>
                        </div>
                      ) : (
                        <DatePicker
                          selectedDate={field.value}
                          onSelect={handleDateSelect}
                          disabledDates={disabledDates}
                          minDaysAhead={0}
                          maxDaysAhead={16}
                          appointmentType={form.watch("appointmentType")}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {/* Step 4: Time Slot Selection */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className="min-h-[480px] space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <Clock className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">زمان را انتخاب کنید</h3>
                  {form.watch("date") && (
                    <p className="text-accent-foreground mt-1 text-sm">
                      تاریخ انتخاب شده: {toShamsi(form.watch("date"))}
                    </p>
                  )}
                </div>
              </div>
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SlotPicker
                        slots={slots}
                        selectedTime={field.value}
                        onSelect={field.onChange}
                        isLoading={loadingSlots}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <ConfirmationSummary form={form} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <StepNavigation
          step={step}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={form.handleSubmit(onSubmit)}
          form={form}
        />
      </Form>
    </div>
  );
}
