"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function unlockApp(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeNextPath(String(formData.get("next") ?? "/"));
  const accessPassword = process.env.APP_ACCESS_PASSWORD;

  if (!accessPassword || password !== accessPassword) {
    redirect(`/access?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();

  cookieStore.set("wb_access", accessPassword, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(nextPath);
}

function getSafeNextPath(nextPath: string) {
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/";
  }

  return nextPath;
}
