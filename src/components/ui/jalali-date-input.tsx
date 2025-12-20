"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { shamsiToGregorian } from "@/lib/shamsi-utils";
import jalaali from "jalaali-js";

// Type declaration for jalaliDatepicker
declare global {
  interface Window {
    jalaliDatepicker: {
      startWatch: (options?: {
        persianDigits?: boolean;
        separatorChars?: { date?: string; between?: string; time?: string };
        autoHide?: boolean;
        hideAfterChange?: boolean;
        autoShow?: boolean;
        [key: string]: unknown;
      }) => void;
      show: (input: HTMLInputElement) => void;
      hide: () => void;
      updateOptions: (options: {
        persianDigits?: boolean;
        separatorChars?: { date?: string; between?: string; time?: string };
        autoHide?: boolean;
        hideAfterChange?: boolean;
        autoShow?: boolean;
        [key: string]: unknown;
      }) => void;
    };
  }
}

interface JalaliDateInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value?: string; // Gregorian YYYY-MM-DD format
  onChange?: (value: string) => void; // Returns Gregorian YYYY-MM-DD
}

/**
 * Convert Gregorian date to Jalali date string without Persian numerals
 * (for date picker input value - library will handle Persian display)
 */
function gregorianToJalaliString(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const jDate = jalaali.toJalaali(year, month, day);
  return `${jDate.jy}/${String(jDate.jm).padStart(2, "0")}/${String(jDate.jd).padStart(2, "0")}`;
}

const JalaliDateInput = React.forwardRef<
  HTMLInputElement,
  JalaliDateInputProps
>(({ value, onChange, className, disabled, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const changeHandlerRef = useRef<((e: Event) => void) | null>(null);

  // Combine refs
  React.useImperativeHandle(ref, () => inputRef.current!);

  // Load the library dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already loaded
    if (window.jalaliDatepicker) {
      setIsLibraryLoaded(true);
      return;
    }

    // Poll for library availability (in case it's loaded by another component)
    const checkInterval = setInterval(() => {
      if (window.jalaliDatepicker) {
        setIsLibraryLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);

    // Try to dynamically import the library
    import("@majidh1/jalalidatepicker/dist/jalalidatepicker.min.js")
      .then(() => {
        // Wait a bit for the global to be set
        setTimeout(() => {
          if (window.jalaliDatepicker) {
            setIsLibraryLoaded(true);
            clearInterval(checkInterval);
          }
        }, 100);
      })
      .catch((error) => {
        console.error("Failed to load jalaliDatepicker:", error);
        clearInterval(checkInterval);
      });

    // Cleanup
    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  // Initialize date picker once library is loaded
  useEffect(() => {
    if (!isLibraryLoaded || !inputRef.current || !window.jalaliDatepicker)
      return;

    const input = inputRef.current;

    // Configure date picker options globally (only once)
    // Use a global flag to ensure startWatch is only called once
    if (
      !(window as { _jalaliDatepickerInitialized?: boolean })
        ._jalaliDatepickerInitialized
    ) {
      window.jalaliDatepicker.startWatch({
        persianDigits: true,
        separatorChars: { date: "/" },
        autoHide: true,
        hideAfterChange: true,
        autoShow: true, // Auto show when input is focused
        zIndex: 9999, // Higher than modal z-50 (which is 50)
      });
      (
        window as { _jalaliDatepickerInitialized?: boolean }
      )._jalaliDatepickerInitialized = true;
    }

    // Ensure data-jdp attribute is set
    if (!input.hasAttribute("data-jdp")) {
      input.setAttribute("data-jdp", "");
    }

    // Handle date changes
    const handleDateChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const jalaliValue = target.value.trim();

      if (jalaliValue && onChange) {
        try {
          // The library returns Persian digits, so we need to convert them to English
          // Convert Persian digits (۰-۹) to English digits (0-9)
          const englishDigits = jalaliValue.replace(/[۰-۹]/g, (d) => {
            const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
            return persianDigits.indexOf(d).toString();
          });

          // Convert Jalali to Gregorian
          const gregorianValue = shamsiToGregorian(englishDigits);
          onChange(gregorianValue);
        } catch (error) {
          console.error("Error converting Jalali date to Gregorian:", error);
        }
      } else if (!jalaliValue && onChange) {
        onChange("");
      }
    };

    changeHandlerRef.current = handleDateChange;
    input.addEventListener("change", handleDateChange);
    input.addEventListener("input", handleDateChange);

    // Set initial value if provided
    if (value) {
      const jalaliValue = gregorianToJalaliString(value);
      if (input.value !== jalaliValue) {
        input.value = jalaliValue;
      }
    }

    // Cleanup
    return () => {
      if (input && changeHandlerRef.current) {
        input.removeEventListener("change", changeHandlerRef.current);
        input.removeEventListener("input", changeHandlerRef.current);
      }
    };
  }, [isLibraryLoaded, onChange, value]);

  // Update input value when value prop changes
  useEffect(() => {
    if (!inputRef.current || !isLibraryLoaded) return;

    const jalaliValue = value ? gregorianToJalaliString(value) : "";

    // Only update if the value is different to avoid infinite loops
    if (inputRef.current.value !== jalaliValue) {
      inputRef.current.value = jalaliValue;
    }
  }, [value, isLibraryLoaded]);

  // Convert Gregorian value to Jalali for display
  const displayValue = value ? gregorianToJalaliString(value) : "";

  return (
    <input
      ref={inputRef}
      data-slot="input"
      data-jdp=""
      defaultValue={displayValue}
      disabled={disabled}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
});

JalaliDateInput.displayName = "JalaliDateInput";

export { JalaliDateInput };
