import { CalendarPlanner } from "./calendar-planner";

import { createClient } from "@/lib/supabase/server";

import type { CalendarEvent } from "./calendar-planner";

export default async function WeddingPlanPage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  let coupleId: string | null = null;
  let initialEvents: CalendarEvent[] = [];
  let setupError: string | null = null;

  if (!isSupabaseConfigured) {
    setupError =
      "Supabase 환경 변수가 설정되면 일정을 추가하거나 삭제할 수 있습니다.";
  } else {
    const supabase = await createClient();
    const { data: couple, error: coupleError } = await supabase
      .from("couples")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (coupleError) {
      setupError =
        "일정을 불러오려면 Supabase 마이그레이션이 먼저 적용되어야 합니다.";
    } else {
      let activeCoupleId = couple?.id ?? null;

      if (!activeCoupleId) {
        const { data: createdCouple, error: createCoupleError } = await supabase
          .from("couples")
          .insert({ name: "우리 결혼 준비" })
          .select("id")
          .single();

        if (createCoupleError) {
          setupError = "커플 정보를 만들지 못했습니다. 잠시 후 다시 시도해주세요.";
        } else {
          activeCoupleId = createdCouple.id;
        }
      }

      coupleId = activeCoupleId;
    }

    if (coupleId) {
      const { data: events, error: eventsError } = await supabase
        .from("wedding_events")
        .select("id, date, title, memo")
        .eq("couple_id", coupleId)
        .order("date", { ascending: true })
        .order("created_at", { ascending: true });

      if (eventsError) {
        setupError = "일정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
      } else {
        initialEvents = events.map((event) => ({
          id: event.id,
          date: event.date,
          title: event.title,
          memo: event.memo ?? undefined,
        }));
      }
    }
  }

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

        <CalendarPlanner
          coupleId={coupleId}
          initialEvents={initialEvents}
          setupError={setupError}
        />
      </div>
    </main>
  );
}
