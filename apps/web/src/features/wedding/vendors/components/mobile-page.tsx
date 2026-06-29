import { MapPin, Phone } from "lucide-react";

import { VendorForm } from "@/features/wedding/vendors/components/vendor-form";

import type { Vendor } from "@/features/wedding/vendors/types";

type VendorsMobilePageProps = {
  vendors: Vendor[];
  setupError: string | null;
};

export function VendorsMobilePage({
  vendors,
  setupError,
}: VendorsMobilePageProps) {
  return (
    <main className="px-4 py-5 pb-24">
      <div className="space-y-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-normal">Vendors</h1>
          <p className="text-muted-foreground text-sm">
            업체 연락처와 상담 내용을 빠르게 확인합니다.
          </p>
        </header>

        <div className="rounded-md border px-4 py-3">
          <p className="text-muted-foreground text-xs">등록 업체</p>
          <p className="text-lg font-semibold">{vendors.length}</p>
        </div>

        {setupError ? <SetupNotice message={setupError} /> : null}

        <VendorForm disabled={Boolean(setupError)} />

        <section className="space-y-3">
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))
          ) : (
            <div className="text-muted-foreground bg-muted/20 rounded-md p-4 text-sm">
              아직 등록된 업체가 없습니다.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <article className="border-border bg-background space-y-3 rounded-md border p-4">
      <div>
        <p className="text-muted-foreground text-sm">{vendor.category}</p>
        <h2 className="truncate font-semibold">{vendor.name}</h2>
      </div>

      <div className="space-y-2 text-sm">
        <InfoLine icon={Phone} value={vendor.phone ?? "전화번호 없음"} />
        <InfoLine icon={MapPin} value={vendor.address ?? "주소 없음"} />
      </div>

      {vendor.memo ? (
        <p className="bg-muted/30 rounded-md p-3 text-sm">{vendor.memo}</p>
      ) : null}
    </article>
  );
}

function InfoLine({
  icon: Icon,
  value,
}: {
  icon: typeof Phone;
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
