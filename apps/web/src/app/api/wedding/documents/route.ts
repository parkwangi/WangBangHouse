import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createDocument, getDocuments } from "@/server/wedding/documents";
import { createDocumentSchema } from "@repo/api/wedding/documents/schema";
import { getVendors } from "@/server/wedding/vendors";

export async function GET() {
  try {
    const [documents, vendors] = await Promise.all([getDocuments(), getVendors()]);

    return NextResponse.json({ documents, vendors });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Documents 데이터를 불러오지 못했습니다.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const parsed = createDocumentSchema.safeParse(await request.json());

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
    await createDocument(parsed.data);

    revalidatePath("/wedding/documents");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "문서 메타데이터를 추가하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
