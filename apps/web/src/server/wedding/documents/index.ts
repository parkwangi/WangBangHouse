import "server-only";

import { pool } from "@/server/db/pool";

import type { DocumentMetadata } from "@repo/api/wedding/documents/types";

type DocumentRow = {
  id: string;
  vendor_id: string | null;
  vendor_name: string | null;
  related_type: string;
  related_id: string | null;
  title: string;
  document_type: string;
  storage_provider: "local" | "s3" | "r2";
  storage_path: string | null;
  original_file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  memo: string | null;
  created_at: Date;
  updated_at: Date;
};

type CreateDocumentParams = {
  vendorId?: string;
  relatedType: string;
  relatedId?: string;
  title: string;
  documentType: string;
  memo?: string;
};

export async function getDocuments() {
  const result = await pool.query<DocumentRow>(
    `
      select
        d.*,
        v.name as vendor_name
      from documents d
      left join vendors v on v.id = d.vendor_id
      order by d.created_at desc
    `,
  );

  return result.rows.map(mapDocumentRow);
}

export async function createDocument(params: CreateDocumentParams) {
  const result = await pool.query<DocumentRow>(
    `
      insert into documents (
        vendor_id,
        related_type,
        related_id,
        title,
        document_type,
        memo
      )
      values ($1, $2, $3, $4, $5, $6)
      returning
        documents.*,
        null::text as vendor_name
    `,
    [
      params.vendorId ?? null,
      params.relatedType,
      params.relatedId ?? null,
      params.title,
      params.documentType,
      params.memo ?? null,
    ],
  );

  return mapDocumentRow(result.rows[0]);
}

function mapDocumentRow(row: DocumentRow): DocumentMetadata {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    vendorName: row.vendor_name,
    relatedType: row.related_type,
    relatedId: row.related_id,
    title: row.title,
    documentType: row.document_type,
    storageProvider: row.storage_provider,
    storagePath: row.storage_path,
    originalFileName: row.original_file_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    memo: row.memo,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
