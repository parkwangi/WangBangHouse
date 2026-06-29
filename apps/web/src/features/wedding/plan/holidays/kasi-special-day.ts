import "server-only";

export type KoreanHoliday = {
  date: string;
  name: string;
};

type KasiSpecialDayItem = {
  dateName?: string;
  isHoliday?: string;
  locdate?: number | string;
};

type KasiSpecialDayResponse = {
  response?: {
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      items?: {
        item?: KasiSpecialDayItem | KasiSpecialDayItem[];
      };
    };
  };
};

const REST_DAY_ENDPOINT =
  "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

export async function getKoreanHolidays(year: number) {
  const serviceKey = process.env.KASI_SPECIAL_DAY_SERVICE_KEY;

  if (!serviceKey) {
    return [];
  }

  const url = new URL(REST_DAY_ENDPOINT);
  url.searchParams.set("solYear", String(year));
  url.searchParams.set("_type", "json");
  url.searchParams.set("numOfRows", "100");

  const response = await fetch(
    `${url.toString()}&ServiceKey=${formatServiceKey(serviceKey)}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    },
  );

  if (!response.ok) {
    throw new Error("공휴일 정보를 불러오지 못했습니다.");
  }

  const data = (await response.json()) as KasiSpecialDayResponse;
  const resultCode = data.response?.header?.resultCode;

  if (resultCode && resultCode !== "00") {
    throw new Error(
      data.response?.header?.resultMsg ?? "공휴일 API 응답이 올바르지 않습니다.",
    );
  }

  return normalizeItems(data.response?.body?.items?.item)
    .filter(isHolidayItem)
    .map((item) => ({
      date: formatLocdate(item.locdate),
      name: item.dateName,
    }));
}

function normalizeItems(
  item: KasiSpecialDayItem | KasiSpecialDayItem[] | undefined,
) {
  if (!item) {
    return [];
  }

  return Array.isArray(item) ? item : [item];
}

function formatLocdate(locdate: number | string) {
  const value = String(locdate);

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function formatServiceKey(serviceKey: string) {
  return serviceKey.includes("%") ? serviceKey : encodeURIComponent(serviceKey);
}

function isHolidayItem(
  item: KasiSpecialDayItem,
): item is Required<Pick<KasiSpecialDayItem, "dateName" | "locdate">> &
  KasiSpecialDayItem {
  return item.isHoliday === "Y" && Boolean(item.locdate) && Boolean(item.dateName);
}
