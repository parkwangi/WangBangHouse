"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { cn } from "@repo/ui/lib/utils";

import { createWeddingScheduleItemAction } from "@/features/wedding/plan/actions/create-schedule-item.action";
import { deleteWeddingScheduleItemAction } from "@/features/wedding/plan/actions/delete-schedule-item.action";
import {
  createWeddingScheduleItemSchema,
  type CreateWeddingScheduleItemFormInput,
  type CreateWeddingScheduleItemInput,
} from "@/features/wedding/plan/schemas/schedule-item.schema";
import {
  dayjs,
  formatDateKey,
  formatReadableDate,
} from "@/features/wedding/shared/date/date-format";

import type { WeddingScheduleItem } from "@/features/wedding/plan/types";

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

type CalendarDayButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  day: {
    date: Date;
  };
  children?: ReactNode;
};

type WeddingPlanCalendarPageProps = {
  tasks: WeddingScheduleItem[];
  setupError: string | null;
  compact?: boolean;
};

type ToastState = {
  id: number;
  message: string;
};

type CalendarHoliday = {
  name: string;
};

type HolidaysApiResponse = {
  holidays?: Array<{
    date: string;
    name: string;
  }>;
};

export function WeddingPlanCalendarPage({
  tasks,
  setupError,
  compact = false,
}: WeddingPlanCalendarPageProps) {
  const router = useRouter();
  const today = useMemo(() => dayjs(), []);
  const requestedHolidayYearsRef = useRef<Set<number>>(new Set());
  const [createdTasks, setCreatedTasks] = useState<WeddingScheduleItem[]>([]);
  const [deletedTaskIds, setDeletedTaskIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [holidaysByDate, setHolidaysByDate] = useState<
    Map<string, CalendarHoliday>
  >(() => new Map());
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(today));
  const [calendarMonth, setCalendarMonth] = useState(() => today.toDate());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const calendarYear = dayjs(calendarMonth).year();

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
  const selectedTasks = tasksByDate.get(selectedDate) ?? [];

  useEffect(() => {
    if (requestedHolidayYearsRef.current.has(calendarYear)) {
      return;
    }

    requestedHolidayYearsRef.current.add(calendarYear);

    const controller = new AbortController();

    async function loadHolidays() {
      try {
        const response = await fetch(`/api/wedding/holidays?year=${calendarYear}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("공휴일 정보를 불러오지 못했습니다.");
        }

        const data = (await response.json()) as HolidaysApiResponse;

        setHolidaysByDate((currentHolidays) => {
          const nextHolidays = new Map(currentHolidays);

          for (const holiday of data.holidays ?? []) {
            nextHolidays.set(holiday.date, { name: holiday.name });
          }

          return nextHolidays;
        });
      } catch {
        if (!controller.signal.aborted) {
          requestedHolidayYearsRef.current.delete(calendarYear);
        }
      }
    }

    void loadHolidays();

    return () => controller.abort();
  }, [calendarYear]);

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

  return (
    <main className={compact ? "px-4 py-5 pb-24" : "p-8"}>
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1
              className={
                compact
                  ? "text-2xl font-semibold tracking-normal"
                  : "text-3xl font-semibold tracking-normal"
              }
            >
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

        <section
          className={
            compact ? "space-y-4" : "grid gap-4 lg:grid-cols-[1fr_300px]"
          }
        >
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
              <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
                <Plus className="size-4" aria-hidden="true" />
                상세 / 추가
              </Button>
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

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        tasks={selectedTasks}
        disabled={Boolean(setupError)}
        onTaskCreated={(task) => {
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
        }}
        onTaskDeleted={(taskId) => {
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
        }}
      />
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

function TaskDialog({
  open,
  onOpenChange,
  selectedDate,
  tasks,
  disabled,
  onTaskCreated,
  onTaskDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
  tasks: WeddingScheduleItem[];
  disabled: boolean;
  onTaskCreated: (task: WeddingScheduleItem) => void;
  onTaskDeleted: (taskId: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(760px,calc(100vh-2rem))] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{formatReadableDate(selectedDate)}</DialogTitle>
          <DialogDescription>
            일정 상세를 확인하고 새 일정을 추가합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-[1fr_280px]">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">일정</h3>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onTaskDeleted={onTaskDeleted}
                />
              ))
            ) : (
              <p className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
                선택한 날짜에 등록된 일정이 없습니다.
              </p>
            )}
          </section>

          <CalendarEventForm
            key={selectedDate}
            selectedDate={selectedDate}
            disabled={disabled}
            onTaskCreated={onTaskCreated}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TaskItem({
  task,
  onTaskDeleted,
}: {
  task: WeddingScheduleItem;
  onTaskDeleted: (taskId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function deleteTask() {
    if (!window.confirm("이 일정을 삭제할까요?")) {
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result = await deleteWeddingScheduleItemAction(task.id);

      if (!result.ok) {
        setMessage(result.message ?? "일정을 삭제하지 못했습니다.");
        return;
      }

      onTaskDeleted(task.id);
    });
  }

  return (
    <article className="bg-muted/30 space-y-3 rounded-md p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{task.title}</p>
          <p className="text-muted-foreground text-sm">{task.category}</p>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={deleteTask}
          disabled={isPending}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          <span className="sr-only">일정 삭제</span>
        </Button>
      </div>
      {task.memo ? (
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
          {task.memo}
        </p>
      ) : null}
      {message ? <p className="text-destructive text-sm">{message}</p> : null}
    </article>
  );
}

function CalendarEventForm({
  selectedDate,
  disabled,
  onTaskCreated,
}: {
  selectedDate: string;
  disabled: boolean;
  onTaskCreated: (task: WeddingScheduleItem) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<
    CreateWeddingScheduleItemFormInput,
    unknown,
    CreateWeddingScheduleItemInput
  >({
    resolver: zodResolver(createWeddingScheduleItemSchema),
    defaultValues: {
      title: "",
      category: "일정",
      scheduledDate: selectedDate,
      memo: "",
    },
  });

  function onSubmit(input: CreateWeddingScheduleItemInput) {
    setFormMessage(null);

    startTransition(async () => {
      const result = await createWeddingScheduleItemAction(input);

      if (!result.ok) {
        setFormMessage(result.message ?? "일정을 추가하지 못했습니다.");
        return;
      }

      if (!result.data) {
        setFormMessage("생성된 일정을 불러오지 못했습니다.");
        return;
      }

      form.reset({
        title: "",
        category: "일정",
        scheduledDate: selectedDate,
        memo: "",
      });
      setFormMessage(null);
      onTaskCreated(result.data);
    });
  }

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-sm font-semibold">일정 추가</h3>
        <p className="text-muted-foreground text-sm">
          {formatReadableDate(selectedDate)}
        </p>
      </div>

      <input type="hidden" {...form.register("scheduledDate")} />

      <Field label="일정명" error={form.formState.errors.title?.message}>
        <Input
          {...form.register("title")}
          placeholder="예: 드레스 투어"
          disabled={disabled || isPending}
        />
      </Field>

      <Field label="구분" error={form.formState.errors.category?.message}>
        <Input
          {...form.register("category")}
          placeholder="일정"
          disabled={disabled || isPending}
        />
      </Field>

      <Field label="메모" error={form.formState.errors.memo?.message}>
        <Textarea
          {...form.register("memo")}
          rows={3}
          placeholder="필요한 내용을 적어두세요."
          disabled={disabled || isPending}
          className="min-h-24 resize-none"
        />
      </Field>

      {formMessage ? (
        <p className="text-destructive text-sm">{formMessage}</p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={disabled || isPending}
      >
        <Plus className="size-4" aria-hidden="true" />
        {isPending ? "추가 중" : "일정 추가"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="text-destructive text-xs">{error}</span> : null}
    </label>
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
