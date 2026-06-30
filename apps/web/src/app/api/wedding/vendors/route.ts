import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createVendor, getVendors } from "@/server/wedding/vendors";
import { createVendorSchema } from "@repo/api/wedding/vendors/schema";

export async function GET() {
  try {
    const vendors = await getVendors();

    return NextResponse.json({ vendors });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Vendors 데이터를 불러오지 못했습니다.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const parsed = createVendorSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "입력값을 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await createVendor(parsed.data);

    revalidatePath("/wedding/vendors");
    revalidatePath("/wedding/budget");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "업체를 추가하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
