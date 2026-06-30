"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { ReactNode } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";

import { weddingPlanApi } from "@/api/client/plan";
import { getApiErrorMessage } from "@/api/error";
import {
  createWeddingScheduleItemSchema,
  type CreateWeddingScheduleItemFormInput,
  type CreateWeddingScheduleItemInput,
} from "@repo/api/wedding/plan/schema";
import { formatReadableDate } from "@repo/api/wedding/shared/date";

import type { WeddingScheduleItem } from "@repo/api/wedding/plan/types";

type TaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  selectedDate: string;
  tasks: WeddingScheduleItem[];
  disabled: boolean;
  onTaskCreated: (task: WeddingScheduleItem) => void;
  onTaskDeleted: (taskId: string) => void;
};

export function TaskDialog({
  open,
  onOpenChange,
  trigger,
  selectedDate,
  tasks,
  disabled,
  onTaskCreated,
  onTaskDeleted,
}: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
      const result = await weddingPlanApi
        .deleteScheduleItem(task.id)
        .catch(async (error) => ({
          ok: false as const,
          message: await getApiErrorMessage(
            error,
            "일정을 삭제하지 못했습니다.",
          ),
        }));

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
      const result = await weddingPlanApi
        .createScheduleItem(input)
        .catch(async (error) => ({
          ok: false as const,
          message: await getApiErrorMessage(
            error,
            "일정을 추가하지 못했습니다.",
          ),
        }));

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

      <Button type="submit" className="w-full" disabled={disabled || isPending}>
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
  children: ReactNode;
}) {
  return (
    <label className="space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="text-destructive text-xs">{error}</span> : null}
    </label>
  );
}
