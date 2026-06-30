"use client";

import { CheckCircle2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Calendar } from "@repo/ui/components/calendar";
import { cn } from "@repo/ui/lib/utils";

import { TaskDialog } from "@/app/wedding/plan/_components/task-dialog";
import {
  dayjs,
  formatDateKey,
  formatReadableDate,
} from "@repo/api/wedding/shared/date";

import type { WeddingScheduleItem } from "@repo/api/wedding/plan/types";

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

type CalendarDayButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  day: {
    date: Date;
  };
  children?: ReactNode;
};

type WeddingPlanCalendarPageProps = {
  tasks: WeddingScheduleItem[];
  holidays: { date: string; name: string }[];
  setupError: string | null;
};

type ToastState = {
  id: number;
  message: string;
};

type CalendarHoliday = {
  name: string;
};

export function WeddingPlanCalendarPage({
  tasks,
  holidays,
  setupError,
}: WeddingPlanCalendarPageProps) {
  const router = useRouter();
  const today = useMemo(() => dayjs(), []);
  const [createdTasks, setCreatedTasks] = useState<WeddingScheduleItem[]>([]);
  const [deletedTaskIds, setDeletedTaskIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(today));
  const [calendarMonth, setCalendarMonth] = useState(() => today.toDate());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const visibleTasks = useMemo(() => {
    const serverTaskIds = new Set(tasks.map((task) => task.id));
    const serverTasks = tasks.filter((task) => !deletedTaskIds.has(task.id));
    const localCreatedTasks = createdTasks.filter(
      (task) => !serverTaskIds.has(task.id) && !deletedTaskIds.has(task.id),
    );

    return [...serverTasks, ...localCreatedTasks];
  }, [createdTasks, deletedTaskIds, tasks]);

  const tasksByDate = useMemo(
    () => groupTasksByDate(visibleTasks),
    [visibleTasks],
  );
  const holidaysByDate = useMemo(
    () =>
      new Map(
        holidays.map((holiday) => [
          holiday.date,
          { name: holiday.name } satisfies CalendarHoliday,
        ]),
      ),
    [holidays],
  );
  const selectedTasks = tasksByDate.get(selectedDate) ?? [];

  function selectDate(date: Date) {
    const dateKey = formatDateKey(dayjs(date));

    if (dateKey === selectedDate) {
      setIsDialogOpen(true);
      return;
    }

    setSelectedDate(dateKey);
    setCalendarMonth(date);
  }

  function selectToday() {
    const todayDate = dayjs().toDate();

    setSelectedDate(formatDateKey(dayjs(todayDate)));
    setCalendarMonth(todayDate);
  }

  function showToast(message: string) {
    setToast({
      id: Date.now(),
      message,
    });
  }

  function handleTaskCreated(task: WeddingScheduleItem) {
    setDeletedTaskIds((currentTaskIds) => {
      const nextTaskIds = new Set(currentTaskIds);
      nextTaskIds.delete(task.id);
      return nextTaskIds;
    });
    setCreatedTasks((currentTasks) => [
      ...currentTasks.filter((currentTask) => currentTask.id !== task.id),
      task,
    ]);
    setIsDialogOpen(false);
    router.refresh();
    showToast("일정이 추가되었습니다.");
  }

  function handleTaskDeleted(taskId: string) {
    setCreatedTasks((currentTasks) =>
      currentTasks.filter((currentTask) => currentTask.id !== taskId),
    );
    setDeletedTaskIds((currentTaskIds) => {
      const nextTaskIds = new Set(currentTaskIds);
      nextTaskIds.add(taskId);
      return nextTaskIds;
    });
    setIsDialogOpen(false);
    router.refresh();
    showToast("일정이 삭제되었습니다.");
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-normal">
              Wedding Plan
            </h1>
            <p className="text-muted-foreground text-sm">
              날짜를 선택해 결혼 준비 일정을 확인하고 추가합니다.
            </p>
          </div>

          <Button variant="outline" onClick={selectToday}>
            오늘
          </Button>
        </header>

        {setupError ? <SetupNotice message={setupError} /> : null}

        <section className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <Card className="gap-4 py-5">
            <CardHeader className="px-5">
              <CardTitle>캘린더</CardTitle>
              <CardDescription>{visibleTasks.length}개 일정</CardDescription>
            </CardHeader>
            <CardContent className="px-5">
              <Calendar
                mode="single"
                fixedWeeks
                selected={dayjs(selectedDate).toDate()}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                onDayClick={selectDate}
                formatters={{
                  formatCaption: (date) => dayjs(date).format("YYYY년 M월"),
                  formatWeekdayName: (date) =>
                    weekdayLabels[date.getDay()] ?? "",
                }}
                className="w-full p-0"
                classNames={{
                  root: "w-full",
                  months: "w-full",
                  month: "w-full gap-5",
                  month_caption: "h-12 px-12",
                  caption_label: "text-base font-semibold",
                  nav: "top-1",
                  button_previous: "size-10",
                  button_next: "size-10",
                  month_grid: "w-full",
                  weekday:
                    "h-10 text-sm first:text-red-600 last:text-blue-600 dark:first:text-red-400 dark:last:text-blue-400",
                  week: "flex w-full",
                  day: "border-border -ml-px -mt-px h-24 flex-1 border sm:h-28 lg:h-32",
                  day_button:
                    "!flex h-full w-full !flex-col !items-start !justify-start rounded-md p-2 text-left text-base font-medium sm:text-lg aria-selected:hover:!bg-background aria-selected:hover:!text-foreground aria-selected:hover:!ring-2 aria-selected:hover:!ring-ring",
                }}
                components={{
                  DayButton: (props) => (
                    <CalendarDayButton
                      {...props}
                      holidaysByDate={holidaysByDate}
                      tasksByDate={tasksByDate}
                    />
                  ),
                }}
              />
            </CardContent>
          </Card>

          <Card className="self-start">
            <CardHeader>
              <CardTitle>{formatReadableDate(selectedDate)}</CardTitle>
              <CardDescription>
                {selectedTasks.length > 0
                  ? `${selectedTasks.length}개 일정`
                  : "등록된 일정 없음"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <TaskDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                trigger={
                  <Button className="w-full">
                    <Plus className="size-4" aria-hidden="true" />
                    상세 / 추가
                  </Button>
                }
                selectedDate={selectedDate}
                tasks={selectedTasks}
                disabled={Boolean(setupError)}
                onTaskCreated={handleTaskCreated}
                onTaskDeleted={handleTaskDeleted}
              />
              {selectedTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="bg-muted/30 rounded-md p-3">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {task.category}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}

function CalendarDayButton({
  day,
  holidaysByDate,
  tasksByDate,
  children,
  className,
  ...props
}: CalendarDayButtonProps & {
  holidaysByDate: Map<string, CalendarHoliday>;
  tasksByDate: Map<string, WeddingScheduleItem[]>;
}) {
  const dateKey = formatDateKey(dayjs(day.date));
  const dateTasks = tasksByDate.get(dateKey) ?? [];
  const holiday = holidaysByDate.get(dateKey);
  const dayOfWeek = day.date.getDay();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  const isSelected =
    props["aria-selected"] === true || props["aria-selected"] === "true";

  return (
    <button type="button" className={className} {...props}>
      <span
        className={cn(
          isSelected
            ? "text-primary-foreground"
            : holiday || isSunday
              ? "text-red-600 dark:text-red-400"
              : isSaturday
                ? "text-blue-600 dark:text-blue-400"
                : undefined,
        )}
      >
        {children}
      </span>
      {holiday ? (
        <span
          className={cn(
            "mt-1 block w-full truncate text-[11px] leading-4 font-medium",
            isSelected
              ? "text-primary-foreground/90"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {holiday.name}
        </span>
      ) : null}
      {dateTasks.length > 0 ? (
        <span className="mt-1 flex w-full flex-col gap-1 overflow-hidden">
          {dateTasks.slice(0, 2).map((task) => (
            <span
              key={task.id}
              className="bg-secondary text-secondary-foreground block truncate rounded-sm px-1.5 py-0.5 text-[11px] leading-4 font-normal sm:text-xs"
            >
              {task.title}
            </span>
          ))}
          {dateTasks.length > 2 ? (
            <span className="text-muted-foreground text-[11px] leading-4 font-normal">
              +{dateTasks.length - 2}
            </span>
          ) : null}
        </span>
      ) : null}
    </button>
  );
}

function SetupNotice({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-4 py-3 text-sm">
      {message}
    </div>
  );
}

function Toast({
  toast,
  onClose,
}: {
  toast: ToastState | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(onClose, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [toast, onClose]);

  if (!toast) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-20 z-50 md:bottom-4" role="status">
      <div className="bg-foreground text-background flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium shadow-lg">
        <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function groupTasksByDate(tasks: WeddingScheduleItem[]) {
  const map = new Map<string, WeddingScheduleItem[]>();

  for (const task of tasks) {
    if (!task.scheduledDate) {
      continue;
    }

    const dateKey = formatDateKey(task.scheduledDate);
    const existing = map.get(dateKey) ?? [];
    existing.push(task);
    map.set(dateKey, existing);
  }

  return map;
}
