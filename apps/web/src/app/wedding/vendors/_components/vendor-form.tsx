"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@repo/ui/components/button";

import { weddingVendorsApi } from "@/api/client/vendors";
import { getApiErrorMessage } from "@/api/error";
import {
  createVendorSchema,
  type CreateVendorFormInput,
  type CreateVendorInput,
} from "@repo/api/wedding/vendors/schema";

export function VendorForm({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<CreateVendorFormInput, unknown, CreateVendorInput>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      name: "",
      category: "",
      phone: "",
      address: "",
      memo: "",
    },
  });

  function onSubmit(input: CreateVendorInput) {
    setFormMessage(null);

    startTransition(async () => {
      const result = await weddingVendorsApi
        .createVendor(input)
        .catch(async (error) => ({
        ok: false as const,
        message: await getApiErrorMessage(error, "업체를 추가하지 못했습니다."),
      }));

      if (!result.ok) {
        setFormMessage(result.message ?? "업체를 추가하지 못했습니다.");
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
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <Field label="업체명" error={form.formState.errors.name?.message}>
          <input
            {...form.register("name")}
            placeholder="예: 스튜디오 샘플"
            disabled={disabled || isPending}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field label="카테고리" error={form.formState.errors.category?.message}>
          <input
            {...form.register("category")}
            placeholder="스튜디오"
            disabled={disabled || isPending}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field label="전화번호" error={form.formState.errors.phone?.message}>
          <input
            {...form.register("phone")}
            placeholder="010-0000-0000"
            disabled={disabled || isPending}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>
      </div>

      <Field label="주소" error={form.formState.errors.address?.message}>
        <input
          {...form.register("address")}
          placeholder="방문 주소나 링크"
          disabled={disabled || isPending}
          className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
        />
      </Field>

      <Field label="메모" error={form.formState.errors.memo?.message}>
        <textarea
          {...form.register("memo")}
          rows={3}
          placeholder="견적 조건, 상담 내용, 담당자 정보를 적어두세요."
          disabled={disabled || isPending}
          className="border-input bg-background focus-visible:ring-ring/50 min-h-24 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
        />
      </Field>

      {formMessage ? (
        <p className="text-destructive text-sm">{formMessage}</p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={disabled || isPending}>
          <Plus className="size-4" aria-hidden="true" />
          {isPending ? "추가 중" : "업체 추가"}
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
