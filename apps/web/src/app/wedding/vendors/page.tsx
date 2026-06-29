import { VendorsDesktopPage } from "@/features/wedding/vendors/components/desktop-page";
import { VendorsMobilePage } from "@/features/wedding/vendors/components/mobile-page";
import { getVendors } from "@/features/wedding/vendors/repositories/vendor.repository";
import { isMobileDevice } from "@/server/device/is-mobile-device";

import type { Vendor } from "@/features/wedding/vendors/types";

type VendorsData = {
  vendors: Vendor[];
  setupError: string | null;
};

export default async function VendorsPage() {
  const [isMobile, data] = await Promise.all([
    isMobileDevice(),
    getVendorsData(),
  ]);

  if (isMobile) {
    return <VendorsMobilePage {...data} />;
  }

  return <VendorsDesktopPage {...data} />;
}

async function getVendorsData(): Promise<VendorsData> {
  try {
    const vendors = await getVendors();

    return {
      vendors,
      setupError: null,
    };
  } catch (error) {
    return {
      vendors: [],
      setupError:
        error instanceof Error
          ? error.message
          : "Vendors 데이터를 불러오지 못했습니다.",
    };
  }
}
