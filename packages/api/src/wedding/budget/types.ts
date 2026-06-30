export type BudgetItem = {
  id: string;
  vendorId: string | null;
  category: string;
  title: string;
  estimatedAmount: number;
  contractedAmount: number | null;
  paidAmount: number;
  paymentDueDate: string | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BudgetSummary = {
  totalEstimatedAmount: number;
  totalContractedAmount: number;
  totalPaidAmount: number;
  remainingAmount: number;
};
