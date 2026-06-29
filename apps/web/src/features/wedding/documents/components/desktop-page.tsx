import { DocumentForm } from "@/features/wedding/documents/components/document-form";

import type { DocumentMetadata } from "@/features/wedding/documents/types";
import type { Vendor } from "@/features/wedding/vendors/types";

type DocumentsDesktopPageProps = {
  documents: DocumentMetadata[];
  vendors: Vendor[];
  setupError: string | null;
};

export function DocumentsDesktopPage({
  documents,
  vendors,
  setupError,
}: DocumentsDesktopPageProps) {
  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-normal">
              Documents
            </h1>
            <p className="text-muted-foreground">
              계약서, 견적서, 영수증 같은 문서 메타데이터를 관리합니다.
            </p>
          </div>

          <div className="rounded-md border px-4 py-3">
            <p className="text-muted-foreground text-xs">등록 문서</p>
            <p className="text-xl font-semibold">{documents.length}</p>
          </div>
        </header>

        {setupError ? <SetupNotice message={setupError} /> : null}

        <DocumentForm vendors={vendors} disabled={Boolean(setupError)} />

        <section className="border-border overflow-hidden rounded-md border">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="border-b text-left">
                <th className="w-[28%] px-4 py-3 font-medium">문서</th>
                <th className="w-[14%] px-4 py-3 font-medium">종류</th>
                <th className="w-[18%] px-4 py-3 font-medium">업체</th>
                <th className="w-[16%] px-4 py-3 font-medium">관련 유형</th>
                <th className="w-[24%] px-4 py-3 font-medium">메모</th>
              </tr>
            </thead>
            <tbody>
              {documents.length > 0 ? (
                documents.map((document) => (
                  <tr key={document.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 align-top">
                      <p className="truncate font-medium">{document.title}</p>
                      {document.originalFileName ? (
                        <p className="text-muted-foreground mt-1 truncate text-xs">
                          {document.originalFileName}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {document.documentType}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {document.vendorName ?? "-"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {document.relatedType}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {document.memo ? (
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {document.memo}
                        </p>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="text-muted-foreground px-4 py-10 text-center"
                    colSpan={5}
                  >
                    아직 등록된 문서가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

function SetupNotice({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-4 py-3 text-sm">
      {message}
    </div>
  );
}
