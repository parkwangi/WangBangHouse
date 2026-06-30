"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@repo/ui/components/button";

import { weddingDocumentsApi } from "@/api/client/documents";
import { getApiErrorMessage } from "@/api/error";
import {
  createDocumentSchema,
  type CreateDocumentFormInput,
  type CreateDocumentInput,
} from "@repo/api/wedding/documents/schema";

type VendorOption = {
  id: string;
  name: string;
};

type DocumentFormProps = {
  vendors: VendorOption[];
  disabled?: boolean;
};

export function DocumentForm({ vendors, disabled = false }: DocumentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<CreateDocumentFormInput, unknown, CreateDocumentInput>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      title: "",
      documentType: "",
      vendorId: "",
      relatedType: "wedding",
      relatedId: "",
      memo: "",
    },
  });

  function onSubmit(input: CreateDocumentInput) {
    setFormMessage(null);

    startTransition(async () => {
      const result = await weddingDocumentsApi
        .createDocument(input)
        .catch(async (error) => ({
        ok: false as const,
        message: await getApiErrorMessage(error, "문서를 추가하지 못했습니다."),
      }));

      if (!result.ok) {
        setFormMessage(result.message ?? "문서를 추가하지 못했습니다.");
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
      <div className="grid gap-3 md:grid-cols-[1fr_180px_220px]">
        <Field label="문서 제목" error={form.formState.errors.title?.message}>
          <input
            {...form.register("title")}
            placeholder="예: 예식장 계약서"
            disabled={disabled || isPending}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field
          label="문서 종류"
          error={form.formState.errors.documentType?.message}
        >
          <input
            {...form.register("documentType")}
            placeholder="계약서"
            disabled={disabled || isPending}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field label="업체" error={form.formState.errors.vendorId?.message}>
          <select
            {...form.register("vendorId")}
            disabled={disabled || isPending}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            <option value="">업체 없음</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
        <Field
          label="관련 유형"
          error={form.formState.errors.relatedType?.message}
        >
          <input
            {...form.register("relatedType")}
            placeholder="wedding"
            disabled={disabled || isPending}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>

        <Field label="관련 ID" error={form.formState.errors.relatedId?.message}>
          <input
            {...form.register("relatedId")}
            placeholder="관련 예산 항목이나 업체 ID"
            disabled={disabled || isPending}
            className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          />
        </Field>
      </div>

      <Field label="메모" error={form.formState.errors.memo?.message}>
        <textarea
          {...form.register("memo")}
          rows={3}
          placeholder="문서 확인 사항이나 보관 위치를 적어두세요."
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
          {isPending ? "추가 중" : "문서 추가"}
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
