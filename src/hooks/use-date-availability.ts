import { useEffect, useState, useRef } from "react";
import type { ShamsiDateInfo } from "./use-visible-dates";

interface UseDateAvailabilityParams {
  visibleDates: ShamsiDateInfo[];
  appointmentType?: string;
}

export function useDateAvailability({
  visibleDates,
  appointmentType,
}: UseDateAvailabilityParams): ShamsiDateInfo[] {
  const [datesWithAvailability, setDatesWithAvailability] =
    useState<ShamsiDateInfo[]>(visibleDates);
  const checkedDatesRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset to visible dates when they change
    setDatesWithAvailability(visibleDates);
    checkedDatesRef.current = "";
    // Abort any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [visibleDates]);

  useEffect(() => {
    if (!appointmentType || visibleDates.length === 0) {
      return;
    }

    const dateStrings = visibleDates.map((d) => d.gregorianDateStr).join(",");

    // Skip if we already checked these dates
    if (checkedDatesRef.current === dateStrings) {
      return;
    }

    checkedDatesRef.current = dateStrings;

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const checkAvailability = async () => {
      // Capture the dates we're checking (from closure)
      const datesToCheck = visibleDates;
      const currentDateStrings = dateStrings;

      // Check if already aborted before starting
      if (abortController.signal.aborted) {
        return;
      }

      // Set all dates to checking state
      setDatesWithAvailability((prev) => {
        // Double-check if aborted
        if (abortController.signal.aborted) {
          return prev;
        }
        const prevDatesStr = prev.map((d) => d.gregorianDateStr).join(",");
        if (prevDatesStr !== currentDateStrings) {
          return prev; // Dates changed, skip
        }
        return prev.map((date) => ({
          ...date,
          isCheckingAvailability: true,
        }));
      });

      // Check availability for each date
      const availabilityPromises = datesToCheck.map(async (dateInfo) => {
        if (!dateInfo.isSelectable) {
          return {
            ...dateInfo,
            hasAvailableSlots: false,
            isCheckingAvailability: false,
          };
        }

        try {
          const res = await fetch(
            `/api/appointments/availability?date=${dateInfo.gregorianDateStr}&appointmentType=${appointmentType}`,
            { signal: abortController.signal },
          );

          // Check if aborted after fetch completes
          if (abortController.signal.aborted) {
            throw new DOMException("Aborted", "AbortError");
          }

          const data = await res.json();

          if (res.ok && data.slots) {
            const hasAvailable = data.slots.some(
              (slot: { available: boolean }) => slot.available,
            );
            return {
              ...dateInfo,
              hasAvailableSlots: hasAvailable,
              isCheckingAvailability: false,
              slots: data.slots, // Cache the slots to avoid redundant requests
            };
          }
          return {
            ...dateInfo,
            hasAvailableSlots: false,
            isCheckingAvailability: false,
          };
        } catch (error) {
          // If aborted, throw to skip this result
          if (error instanceof Error && error.name === "AbortError") {
            throw error;
          }
          return {
            ...dateInfo,
            hasAvailableSlots: false,
            isCheckingAvailability: false,
          };
        }
      });

      try {
        const updatedDates = await Promise.all(availabilityPromises);

        // Check if request was aborted before updating state
        if (abortController.signal.aborted) {
          return;
        }

        // Update state with results only if dates haven't changed
        setDatesWithAvailability((prev) => {
          if (abortController.signal.aborted) {
            return prev;
          }
          const prevDatesStr = prev.map((d) => d.gregorianDateStr).join(",");
          if (prevDatesStr !== currentDateStrings) {
            return prev; // Dates changed, don't update
          }
          return updatedDates;
        });
      } catch (error) {
        // If any promise rejected due to abort, ignore
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        // Re-throw other errors
        throw error;
      }
    };

    checkAvailability();

    // Cleanup: abort request if component unmounts or effect re-runs
    return () => {
      if (abortControllerRef.current === abortController) {
        abortController.abort();
        abortControllerRef.current = null;
      }
    };
  }, [appointmentType, visibleDates]);

  return datesWithAvailability;
}
