"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  captionLayout = "label",
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn("bg-background p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root, classNames?.root),
        months: cn(
          "relative flex flex-col gap-4 sm:flex-row",
          defaultClassNames.months,
          classNames?.months,
        ),
        month: cn(
          "flex w-full flex-col gap-4",
          defaultClassNames.month,
          classNames?.month,
        ),
        month_caption: cn(
          "flex h-9 items-center justify-center px-9",
          defaultClassNames.month_caption,
          classNames?.month_caption,
        ),
        caption_label: cn(
          "truncate text-sm font-medium",
          defaultClassNames.caption_label,
          classNames?.caption_label,
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex items-center justify-between",
          defaultClassNames.nav,
          classNames?.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 p-0",
          defaultClassNames.button_previous,
          classNames?.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 p-0",
          defaultClassNames.button_next,
          classNames?.button_next,
        ),
        month_grid: cn(
          "w-full border-collapse",
          defaultClassNames.month_grid,
          classNames?.month_grid,
        ),
        weekdays: cn("flex", defaultClassNames.weekdays, classNames?.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday,
          classNames?.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week, classNames?.week),
        day: cn(
          "relative flex size-9 flex-1 items-center justify-center p-0 text-center text-sm",
          defaultClassNames.day,
          classNames?.day,
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 rounded-md p-0 font-normal aria-selected:opacity-100",
          defaultClassNames.day_button,
          classNames?.day_button,
        ),
        selected: cn(
          "rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          defaultClassNames.selected,
          classNames?.selected,
        ),
        today: cn(
          "text-primary font-semibold",
          defaultClassNames.today,
          classNames?.today,
        ),
        outside: cn(
          "text-muted-foreground opacity-50 aria-selected:text-muted-foreground",
          defaultClassNames.outside,
          classNames?.outside,
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled,
          classNames?.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden, classNames?.hidden),
      }}
      components={{
        Chevron: ({ orientation, className, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft
              className={cn("size-4", className)}
              {...chevronProps}
            />
          ) : (
            <ChevronRight
              className={cn("size-4", className)}
              {...chevronProps}
            />
          ),
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
