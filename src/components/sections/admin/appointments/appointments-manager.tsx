"use client";

import { useState, useCallback } from "react";
import { AppointmentsFilterForm } from "./appointments-filter-form";
import { AppointmentsDataWrapper } from "./appointments-data-wrapper";
import type { AppointmentsFilterFormData } from "@/lib/validation-schema";

export function AppointmentsManager() {
  const [filters, setFilters] = useState<AppointmentsFilterFormData>({
    fromDate: "",
    toDate: "",
    status: "",
    appointmentType: "",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(1);

  const handleFilterChange = useCallback(
    (newFilters: AppointmentsFilterFormData) => {
      setFilters(newFilters);
      setPage(1); // Reset to page 1 when filters change
    },
    [],
  );

  const handleReset = useCallback(() => {
    setFilters({
      fromDate: "",
      toDate: "",
      status: "",
      appointmentType: "",
      sortOrder: "desc",
    });
    setPage(1);
  }, []);

  return (
    <>
      <div className="mb-6 space-y-4">
        <AppointmentsFilterForm
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>
      <AppointmentsDataWrapper
        filters={filters}
        page={page}
        onPageChange={setPage}
      />
    </>
  );
}
