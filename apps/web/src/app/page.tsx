import { Button } from "@repo/ui/components/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-xl space-y-6">
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium">
            Next.js monorepo starter
          </p>
          <h1 className="text-4xl font-semibold tracking-normal">Wang Bang</h1>
          <p className="text-muted-foreground">
            Next.js, TypeScript, Tailwind CSS, ESLint, Prettier, shadcn/ui, pnpm
            workspace 기반으로 초기 설정되었습니다.
          </p>
        </div>
        <Button>시작하기</Button>
      </section>
    </main>
  );
}
