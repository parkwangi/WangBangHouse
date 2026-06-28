import { CalendarPlanner } from "./calendar-planner";

export default function WeddingPlanPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-normal">
            Wedding Plan
          </h1>
          <p className="text-muted-foreground">
            결혼 준비 일정을 달력으로 관리합니다.
          </p>
        </div>

        <CalendarPlanner />
      </div>
    </main>
  );
}
