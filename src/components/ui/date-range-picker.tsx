"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function DateRangePicker({
  date,
  setDate,
}: {
  date?: DateRange;
  setDate: (range: DateRange | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[260px] justify-start text-left font-normal bg-white text-black"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#161b33] text-white" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="text-white"
          classNames={{
            day_today: "bg-accent text-white font-bold",
            day: "text-white hover:bg-accent hover:text-white focus:bg-accent focus:text-white",
            caption: "text-white",
            nav_button_previous: "text-white",
            nav_button_next: "text-white",
            head_cell: "text-white"
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
