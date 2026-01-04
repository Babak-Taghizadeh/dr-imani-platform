"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { BookingFormData } from "@/lib/validation-schema";

type Step = 1 | 2 | 3 | 4 | 5;

interface StepNavigationProps {
  step: Step;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  form: UseFormReturn<BookingFormData>;
}

export function StepNavigation({
  step,
  onBack,
  onNext,
  onSubmit,
  form,
}: StepNavigationProps) {
  const isFirstStep = step === 1;
  const isLastStep = step === 5;
  const isSubmitting = form.formState.isSubmitting;

  const canProceed = () => {
    if (step === 1) return !!form.watch("appointmentType");
    if (step === 2) return !!form.watch("ageRange");
    if (step === 3) return !!form.watch("date");
    if (step === 4) return !!form.watch("time");
    return true;
  };

  return (
    <div className="flex justify-between border-t pt-6">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className="min-w-[100px]"
      >
        <ArrowRight className="ml-2 h-4 w-4" />
        قبلی
      </Button>
      {!isLastStep ? (
        <Button
          onClick={onNext}
          disabled={!canProceed() || isSubmitting}
          className="min-w-[100px]"
        >
          بعدی
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[150px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? "در حال پردازش..." : "پرداخت و تکمیل نوبت"}
        </Button>
      )}
    </div>
  );
}

