import { Building2, FileText } from "lucide-react";

import { DocumentForm } from "@/features/wedding/documents/components/document-form";

import type { DocumentMetadata } from "@/features/wedding/documents/types";
import type { Vendor } from "@/features/wedding/vendors/types";

type DocumentsMobilePageProps = {
  documents: DocumentMetadata[];
  vendors: Vendor[];
  setupError: string | null;
};

export function DocumentsMobilePage({
  documents,
  vendors,
  setupError,
}: DocumentsMobilePageProps) {
  return (
    <main className="px-4 py-5 pb-24">
      <div className="space-y-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-normal">Documents</h1>
          <p className="text-muted-foreground text-sm">
            문서 정보와 연결된 업체를 빠르게 확인합니다.
          </p>
        </header>

        <div className="rounded-md border px-4 py-3">
          <p className="text-muted-foreground text-xs">등록 문서</p>
          <p className="text-lg font-semibold">{documents.length}</p>
        </div>

        {setupError ? <SetupNotice message={setupError} /> : null}

        <DocumentForm vendors={vendors} disabled={Boolean(setupError)} />

        <section className="space-y-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))
          ) : (
            <div className="text-muted-foreground bg-muted/20 rounded-md p-4 text-sm">
              아직 등록된 문서가 없습니다.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DocumentCard({ document }: { document: DocumentMetadata }) {
  return (
    <article className="border-border bg-background space-y-3 rounded-md border p-4">
      <div>
        <p className="text-muted-foreground text-sm">{document.documentType}</p>
        <h2 className="truncate font-semibold">{document.title}</h2>
      </div>

      <div className="space-y-2 text-sm">
        <InfoLine icon={Building2} value={document.vendorName ?? "업체 없음"} />
        <InfoLine icon={FileText} value={document.relatedType} />
      </div>

      {document.memo ? (
        <p className="bg-muted/30 rounded-md p-3 text-sm">{document.memo}</p>
      ) : null}
    </article>
  );
}

function InfoLine({
  icon: Icon,
  value,
}: {
  icon: typeof FileText;
  value: string;
}) {
  return (
    <div className="text-muted-foreground flex min-w-0 items-center gap-2">
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function SetupNotice({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
      {message}
    </div>
  );
}
