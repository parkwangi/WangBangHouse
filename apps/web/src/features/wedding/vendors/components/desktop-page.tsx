import { VendorForm } from "@/features/wedding/vendors/components/vendor-form";

import type { Vendor } from "@/features/wedding/vendors/types";

type VendorsDesktopPageProps = {
  vendors: Vendor[];
  setupError: string | null;
};

export function VendorsDesktopPage({
  vendors,
  setupError,
}: VendorsDesktopPageProps) {
  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-normal">Vendors</h1>
            <p className="text-muted-foreground">
              결혼 준비 업체와 상담 정보를 관리합니다.
            </p>
          </div>

          <div className="rounded-md border px-4 py-3">
            <p className="text-muted-foreground text-xs">등록 업체</p>
            <p className="text-xl font-semibold">{vendors.length}</p>
          </div>
        </header>

        {setupError ? <SetupNotice message={setupError} /> : null}

        <VendorForm disabled={Boolean(setupError)} />

        <section className="border-border overflow-hidden rounded-md border">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="border-b text-left">
                <th className="w-[22%] px-4 py-3 font-medium">업체명</th>
                <th className="w-[16%] px-4 py-3 font-medium">카테고리</th>
                <th className="w-[18%] px-4 py-3 font-medium">전화번호</th>
                <th className="w-[24%] px-4 py-3 font-medium">주소</th>
                <th className="w-[20%] px-4 py-3 font-medium">메모</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 align-top">
                      <p className="truncate font-medium">{vendor.name}</p>
                    </td>
                    <td className="px-4 py-3 align-top">{vendor.category}</td>
                    <td className="px-4 py-3 align-top">
                      {vendor.phone ?? "-"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="truncate">{vendor.address ?? "-"}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {vendor.memo ? (
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {vendor.memo}
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
                    아직 등록된 업체가 없습니다.
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
