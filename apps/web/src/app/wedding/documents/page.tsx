import { DocumentsDesktopPage } from "@/app/wedding/documents/_components/desktop-page";
import { getApiErrorMessage } from "@/api/error";
import { weddingDocumentsQueryOptions } from "@/queries/server/documents";

import type { DocumentMetadata } from "@repo/api/wedding/documents/types";
import type { Vendor } from "@repo/api/wedding/vendors/types";

type DocumentsData = {
  documents: DocumentMetadata[];
  vendors: Vendor[];
  setupError: string | null;
};

export default async function DocumentsPage() {
  const data = await getDocumentsData();

  return <DocumentsDesktopPage {...data} />;
}

async function getDocumentsData(): Promise<DocumentsData> {
  try {
    const data = await weddingDocumentsQueryOptions.pageData().queryFn();

    return {
      ...data,
      setupError: null,
    };
  } catch (error) {
    return {
      documents: [],
      vendors: [],
      setupError: await getApiErrorMessage(
        error,
        "Documents 데이터를 불러오지 못했습니다.",
      ),
    };
  }
}
