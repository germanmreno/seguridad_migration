"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { display12HourValue, setDateByType } from "./time-picker-utils";

export const TimePeriodSelect = React.forwardRef(
  ({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus }, ref) => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
    };

    const handleValueChange = (value) => {
      setPeriod(value);

      if (date) {
        try {
          const tempDate = date instanceof Date ? date : new Date(date);
          if (isNaN(tempDate.getTime())) return; // Invalid date check

          const hours = display12HourValue(tempDate.getHours());
          setDate(
            setDateByType(
              tempDate,
              hours.toString(),
              "12hours",
              period === "AM" ? "PM" : "AM"
            )
          );
        } catch (error) {
          console.error("Error processing date:", error);
        }
      }
    };

    return (
      <div className="flex h-10 items-center">
        <Select
          defaultValue={period}
          onValueChange={(value) => handleValueChange(value)}
        >
          <SelectTrigger
            ref={ref}
            className="w-[65px] focus:bg-accent focus:text-accent-foreground"
            onKeyDown={handleKeyDown}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

TimePeriodSelect.displayName = "TimePeriodSelect";