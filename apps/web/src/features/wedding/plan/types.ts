import type { WeddingTaskStatus } from "@/features/wedding/plan/schemas/task.schema";

export type WeddingTask = {
  id: string;
  weddingProjectId: string;
  title: string;
  category: string;
  dueDate: string | null;
  status: WeddingTaskStatus;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
};
