import { z } from "zod";

export const dashboardScheduleItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  scheduledDate: z.string().nullable(),
  dday: z.number().nullable(),
});

export const dashboardPaymentSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  paymentDueDate: z.string().nullable(),
  contractedAmount: z.number().nullable(),
  paidAmount: z.number(),
});

export const weddingDashboardDataSchema = z.object({
  totalEstimatedAmount: z.number(),
  totalContractedAmount: z.number(),
  totalPaidAmount: z.number(),
  remainingAmount: z.number(),
  upcomingScheduleItemCount: z.number(),
  vendorCount: z.number(),
  documentCount: z.number(),
  upcomingScheduleItems: z.array(dashboardScheduleItemSchema),
  upcomingPayments: z.array(dashboardPaymentSchema),
});
