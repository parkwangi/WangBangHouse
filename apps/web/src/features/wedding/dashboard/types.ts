export type DashboardTask = {
  id: string;
  title: string;
  category: string;
  dueDate: string | null;
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
  weddingDate: string | null;
  venueName: string | null;
  dday: number | null;
  totalEstimatedAmount: number;
  totalContractedAmount: number;
  totalPaidAmount: number;
  remainingAmount: number;
  incompleteTaskCount: number;
  vendorCount: number;
  documentCount: number;
  upcomingTasks: DashboardTask[];
  upcomingPayments: DashboardPayment[];
};
