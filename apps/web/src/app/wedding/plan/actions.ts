"use server";

import { createClient } from "@/lib/supabase/server";

import type { CalendarEvent } from "./calendar-planner";

export async function createWeddingEvent(input: {
  coupleId: string;
  date: string;
  title: string;
  memo?: string;
}): Promise<{ event?: CalendarEvent; error?: string }> {
  const title = input.title.trim();

  if (!title) {
    return { error: "일정명을 입력해주세요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wedding_events")
    .insert({
      couple_id: input.coupleId,
      date: input.date,
      title,
      memo: input.memo?.trim() || null,
    })
    .select("id, date, title, memo")
    .single();

  if (error) {
    return { error: error.message };
  }

  return {
    event: {
      id: data.id,
      date: data.date,
      title: data.title,
      memo: data.memo ?? undefined,
    },
  };
}

export async function deleteWeddingEvent(input: {
  coupleId: string;
  eventId: string;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("wedding_events")
    .delete()
    .eq("id", input.eventId)
    .eq("couple_id", input.coupleId);

  if (error) {
    return { error: error.message };
  }

  return {};
}
