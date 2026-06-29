export type DocumentMetadata = {
  id: string;
  householdId: string;
  vendorId: string | null;
  vendorName: string | null;
  relatedType: string;
  relatedId: string | null;
  title: string;
  documentType: string;
  storageProvider: "local" | "s3" | "r2" | "supabase";
  storagePath: string | null;
  originalFileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
};
