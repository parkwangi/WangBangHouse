import { VendorsDesktopPage } from "@/app/wedding/vendors/_components/desktop-page";
import { getApiErrorMessage } from "@/api/error";
import { weddingVendorsQueryOptions } from "@/queries/server/vendors";

import type { Vendor } from "@repo/api/wedding/vendors/types";

type VendorsData = {
  vendors: Vendor[];
  setupError: string | null;
};

export default async function VendorsPage() {
  const data = await getVendorsData();

  return <VendorsDesktopPage {...data} />;
}

async function getVendorsData(): Promise<VendorsData> {
  try {
    const data = await weddingVendorsQueryOptions.list().queryFn();

    return {
      ...data,
      setupError: null,
    };
  } catch (error) {
    return {
      vendors: [],
      setupError: await getApiErrorMessage(
        error,
        "Vendors 데이터를 불러오지 못했습니다.",
      ),
    };
  }
}
