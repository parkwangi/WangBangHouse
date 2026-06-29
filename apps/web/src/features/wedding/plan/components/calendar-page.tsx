"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
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

import { createWeddingTaskAction } from "@/features/wedding/plan/actions/create-task.action";
import { deleteWeddingTaskAction } from "@/features/wedding/plan/actions/delete-task.action";
import {
  createWeddingTaskSchema,
  type CreateWeddingTaskFormInput,
  type CreateWeddingTaskInput,
} from "@/features/wedding/plan/schemas/task.schema";
import {
  dayjs,
  formatDateKey,
  formatReadableDate,
} from "@/features/wedding/shared/date/date-format";

import type { WeddingTask } from "@/features/wedding/plan/types";

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

type CalendarDayButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  day: {
    date: Date;
  };
  children?: ReactNode;
};

type WeddingPlanCalendarPageProps = {
  tasks: WeddingTask[];
  weddingProjectId: string | null;
  setupError: string | null;
  compact?: boolean;
};

export function WeddingPlanCalendarPage({
  tasks,
  weddingProjectId,
  setupError,
  compact = false,
}: WeddingPlanCalendarPageProps) {
  const today = useMemo(() => dayjs(), []);
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(today));
  const [calendarMonth, setCalendarMonth] = useState(() => today.toDate());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tasksByDate = useMemo(() => groupTasksByDate(tasks), [tasks]);
  const selectedTasks = tasksByDate.get(selectedDate) ?? [];
  const scheduledDates = useMemo(
    () => Array.from(tasksByDate.keys(), (dateKey) => dayjs(dateKey).toDate()),
    [tasksByDate],
  );

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
              <CardDescription>{tasks.length}개 일정</CardDescription>
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
                modifiers={{ hasTasks: scheduledDates }}
                modifiersClassNames={{
                  hasTasks:
                    "after:bg-primary after:absolute after:bottom-2 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full",
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
                  weekday: "h-10 text-sm",
                  week: "mt-2 flex w-full gap-1",
                  day: "h-24 flex-1 sm:h-28 lg:h-32",
                  day_button:
                    "h-full w-full items-start rounded-md p-2 text-left text-base font-medium sm:text-lg aria-selected:hover:!bg-background aria-selected:hover:!text-foreground aria-selected:hover:!ring-2 aria-selected:hover:!ring-ring",
                }}
                components={{
                  DayButton: (props) => (
                    <CalendarDayButton {...props} tasksByDate={tasksByDate} />
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
        weddingProjectId={weddingProjectId}
        disabled={Boolean(setupError)}
      />
    </main>
  );
}

function CalendarDayButton({
  day,
  tasksByDate,
  children,
  className,
  ...props
}: CalendarDayButtonProps & {
  tasksByDate: Map<string, WeddingTask[]>;
}) {
  const dateTasks = tasksByDate.get(formatDateKey(dayjs(day.date))) ?? [];

  return (
    <button type="button" className={className} {...props}>
      <span>{children}</span>
      {dateTasks.length > 0 ? (
        <span className="mt-2 flex w-full flex-col gap-1 overflow-hidden">
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
  weddingProjectId,
  disabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
  tasks: WeddingTask[];
  weddingProjectId: string | null;
  disabled: boolean;
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
              tasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
                선택한 날짜에 등록된 일정이 없습니다.
              </p>
            )}
          </section>

          <CalendarEventForm
            key={selectedDate}
            selectedDate={selectedDate}
            weddingProjectId={weddingProjectId}
            disabled={disabled}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TaskItem({ task }: { task: WeddingTask }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function deleteTask() {
    if (!window.confirm("이 일정을 삭제할까요?")) {
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result = await deleteWeddingTaskAction(task.id);

      if (!result.ok) {
        setMessage(result.message ?? "일정을 삭제하지 못했습니다.");
      }
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
  weddingProjectId,
  disabled,
}: {
  selectedDate: string;
  weddingProjectId: string | null;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<
    CreateWeddingTaskFormInput,
    unknown,
    CreateWeddingTaskInput
  >({
    resolver: zodResolver(createWeddingTaskSchema),
    defaultValues: {
      title: "",
      category: "일정",
      dueDate: selectedDate,
      memo: "",
    },
  });

  function onSubmit(input: CreateWeddingTaskInput) {
    if (!weddingProjectId) {
      setFormMessage("DEV_WEDDING_PROJECT_ID를 먼저 설정해주세요.");
      return;
    }

    setFormMessage(null);

    startTransition(async () => {
      const result = await createWeddingTaskAction(weddingProjectId, input);

      if (!result.ok) {
        setFormMessage(result.message ?? "일정을 추가하지 못했습니다.");
        return;
      }

      form.reset({
        title: "",
        category: "일정",
        dueDate: selectedDate,
        memo: "",
      });
      setFormMessage(null);
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

      <input type="hidden" {...form.register("dueDate")} />

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
        disabled={disabled || isPending || !weddingProjectId}
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

function groupTasksByDate(tasks: WeddingTask[]) {
  const map = new Map<string, WeddingTask[]>();

  for (const task of tasks) {
    if (!task.dueDate) {
      continue;
    }

    const existing = map.get(task.dueDate) ?? [];
    existing.push(task);
    map.set(task.dueDate, existing);
  }

  return map;
}
