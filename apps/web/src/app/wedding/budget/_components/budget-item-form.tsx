"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@repo/ui/components/button";

import { weddingBudgetApi } from "@/api/client/budget";
import { getApiErrorMessage } from "@/api/error";
import {
  createBudgetItemSchema,
  type CreateBudgetItemFormInput,
  type CreateBudgetItemInput,
} from "@repo/api/wedding/budget/schema";

export function BudgetItemForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<
    CreateBudgetItemFormInput,
    unknown,
    CreateBudgetItemInput
  >({
    resolver: zodResolver(createBudgetItemSchema),
    defaultValues: {
      category: "",
      title: "",
      estimatedAmount: 0,
      contractedAmount: undefined,
      paidAmount: 0,
      paymentDueDate: "",
      memo: "",
    },
  });

  function onSubmit(input: CreateBudgetItemInput) {
    setFormMessage(null);

    startTransition(async () => {
      const result = await weddingBudgetApi
        .createBudgetItem(input)
        .catch(async (error) => ({
        ok: false as const,
        message: await getApiErrorMessage(
          error,
          "예산 항목을 추가하지 못했습니다.",
        ),
      }));

      if (!result.ok) {
        setFormMessage(result.message ?? "예산 항목을 추가하지 못했습니다.");
        return;
      }

      form.reset();
      setFormMessage(null);
      router.refresh();
    });
  }

  return (
    <form
      className="border-border bg-background space-y-4 rounded-md border p-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid gap-3 md:grid-cols-[160px_1fr]">
        <Field label="카테고리" error={form.formState.errors.category?.message}>
          <input
            {...form.register("category")}
            placeholder="예식장"
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field label="항목명" error={form.formState.errors.title?.message}>
          <input
            {...form.register("title")}
            placeholder="예: 본식 대관료"
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Field
          label="예상 금액"
          error={form.formState.errors.estimatedAmount?.message}
        >
          <input
            type="number"
            min={0}
            {...form.register("estimatedAmount")}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field
          label="계약 금액"
          error={form.formState.errors.contractedAmount?.message}
        >
          <input
            type="number"
            min={0}
            {...form.register("contractedAmount")}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field
          label="결제 완료"
          error={form.formState.errors.paidAmount?.message}
        >
          <input
            type="number"
            min={0}
            {...form.register("paidAmount")}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field
          label="결제 예정일"
          error={form.formState.errors.paymentDueDate?.message}
        >
          <input
            type="date"
            {...form.register("paymentDueDate")}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>
      </div>

      <Field label="메모" error={form.formState.errors.memo?.message}>
        <textarea
          {...form.register("memo")}
          rows={3}
          placeholder="견적 조건이나 확인할 내용을 적어두세요."
          className="border-input bg-background focus-visible:ring-ring/50 min-h-24 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
        />
      </Field>

      {formMessage ? (
        <p className="text-destructive text-sm">{formMessage}</p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Plus className="size-4" aria-hidden="true" />
          {isPending ? "추가 중" : "예산 항목 추가"}
        </Button>
      </div>
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
