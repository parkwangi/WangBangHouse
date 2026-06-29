import { DocumentsDesktopPage } from "@/features/wedding/documents/components/desktop-page";
import { DocumentsMobilePage } from "@/features/wedding/documents/components/mobile-page";
import { getDocuments } from "@/features/wedding/documents/repositories/document.repository";
import { getVendors } from "@/features/wedding/vendors/repositories/vendor.repository";
import { isMobileDevice } from "@/server/device/is-mobile-device";

import type { DocumentMetadata } from "@/features/wedding/documents/types";
import type { Vendor } from "@/features/wedding/vendors/types";

type DocumentsData = {
  documents: DocumentMetadata[];
  vendors: Vendor[];
  setupError: string | null;
};

export default async function DocumentsPage() {
  const [isMobile, data] = await Promise.all([
    isMobileDevice(),
    getDocumentsData(),
  ]);

  if (isMobile) {
    return <DocumentsMobilePage {...data} />;
  }

  return <DocumentsDesktopPage {...data} />;
}

async function getDocumentsData(): Promise<DocumentsData> {
  try {
    const [documents, vendors] = await Promise.all([getDocuments(), getVendors()]);

    return {
      documents,
      vendors,
      setupError: null,
    };
  } catch (error) {
    return {
      documents: [],
      vendors: [],
      setupError:
        error instanceof Error
          ? error.message
          : "Documents 데이터를 불러오지 못했습니다.",
    };
  }
}
