export type DashboardScheduleItem = {
  id: string;
  title: string;
  category: string;
  scheduledDate: string | null;
  dday: number | null;
};

export type DashboardPayment = {
  id: string;
  title: string;
  category: string;
  paymentDueDate: string | null;
  contractedAmount: number | null;
  paidAmount: number;
};

export type WeddingDashboardData = {
  totalEstimatedAmount: number;
  totalContractedAmount: number;
  totalPaidAmount: number;
  remainingAmount: number;
  upcomingScheduleItemCount: number;
  vendorCount: number;
  documentCount: number;
  upcomingScheduleItems: DashboardScheduleItem[];
  upcomingPayments: DashboardPayment[];
};
