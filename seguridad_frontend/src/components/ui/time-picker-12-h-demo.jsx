"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";
import { TimePeriodSelect } from "./period-select";
import { cn } from "@/lib/utils";

export function TimePicker12Demo({ date, setDate, period, className }) {
  const [periodState, setPeriodState] = React.useState(period);
  console.log(period)

  const minuteRef = React.useRef(null);
  const hourRef = React.useRef(null);
  const secondRef = React.useRef(null);
  const periodRef = React.useRef(null);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hora
        </Label>
        <TimePickerInput
          picker="12hours"
          period={period}
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
          className="bg-white dark:bg-gray-800"
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutos
        </Label>
        <TimePickerInput
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
          className="bg-white dark:bg-gray-800"
        />
      </div>

      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs">
          Periodo
        </Label>
        <TimePeriodSelect
          period={periodState}
          setPeriod={setPeriodState}
          date={date}
          setDate={setDate}
          ref={periodRef}
          onLeftFocus={() => secondRef.current?.focus()}
          className="bg-white dark:bg-gray-800"
        />
      </div>
    </div>
  );
}