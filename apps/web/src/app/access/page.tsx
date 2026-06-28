import { LockKeyhole } from "lucide-react";

import { Button } from "@repo/ui/components/button";

import { unlockApp } from "./actions";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
}) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);
  const isPasswordConfigured = Boolean(process.env.APP_ACCESS_PASSWORD);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-sm space-y-5">
        <div className="space-y-3 text-center">
          <div className="bg-primary text-primary-foreground mx-auto flex size-11 items-center justify-center rounded-md">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-normal">
              Wang Bang
            </h1>
            <p className="text-muted-foreground text-sm">
              비밀번호를 입력하면 앱에 접근할 수 있습니다.
            </p>
          </div>
        </div>

        <form action={unlockApp} className="space-y-3">
          <input type="hidden" name="next" value={nextPath} />
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
            />
          </div>

          {!isPasswordConfigured ? (
            <p className="text-destructive text-sm">
              APP_ACCESS_PASSWORD 환경 변수를 설정해주세요.
            </p>
          ) : null}

          {params.error ? (
            <p className="text-destructive text-sm">
              비밀번호가 일치하지 않습니다.
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={!isPasswordConfigured}
          >
            입장
          </Button>
        </form>
      </section>
    </main>
  );
}

function getSafeNextPath(nextPath?: string) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/";
  }

  return nextPath;
}
