"use client";

import { CalendarPlus, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@repo/ui/components/button";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  memo?: string;
};

const initialEvents: CalendarEvent[] = [
  {
    id: "venue-consulting",
    date: "2026-07-04",
    title: "예식장 상담",
  },
  {
    id: "dress-tour",
    date: "2026-07-12",
    title: "드레스 투어",
  },
  {
    id: "snap-meeting",
    date: "2026-07-20",
    title: "스냅 미팅",
  },
];

export function CalendarPlanner() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(today));
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(year, month, 1 - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);

      const dateKey = formatDateKey(date);

      return {
        date,
        dateKey,
        currentMonth: date.getMonth() === month,
        today: dateKey === formatDateKey(today),
        selected: dateKey === selectedDate,
        events: events.filter((event) => event.date === dateKey),
      };
    });
  }, [events, selectedDate, today, viewDate]);

  const selectedDateEvents = events.filter(
    (event) => event.date === selectedDate,
  );

  const monthLabel = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(viewDate);

  function moveMonth(amount: number) {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + amount),
    );
  }

  function openDate(dateKey: string) {
    const date = parseDateKey(dateKey);

    setSelectedDate(dateKey);
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  function addEvent() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setEvents((current) => [
      ...current,
      {
        id: `${selectedDate}-${Date.now()}`,
        date: selectedDate,
        title: trimmedTitle,
        memo: memo.trim() || undefined,
      },
    ]);
    setTitle("");
    setMemo("");
  }

  function removeEvent(id: string) {
    setEvents((current) => current.filter((event) => event.id !== id));
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">
            {monthLabel}
          </h2>
          <p className="text-muted-foreground text-sm">
            결혼 준비 일정을 월별로 확인합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => moveMonth(-1)}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="sr-only">이전 달</span>
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
            }
          >
            오늘
          </Button>
          <Button variant="outline" size="icon" onClick={() => moveMonth(1)}>
            <ChevronRight className="size-4" aria-hidden="true" />
            <span className="sr-only">다음 달</span>
          </Button>
          <Button onClick={() => openDate(formatDateKey(today))}>
            <CalendarPlus className="size-4" aria-hidden="true" />
            일정 추가
          </Button>
        </div>
      </div>

      <div className="border-border overflow-hidden rounded-md border">
        <div className="bg-muted/40 grid grid-cols-7 border-b">
          {weekdays.map((weekday) => (
            <div
              key={weekday}
              className="text-muted-foreground flex h-10 items-center justify-center text-xs font-medium"
            >
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day) => (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => openDate(day.dateKey)}
              className={[
                "border-border min-h-24 border-r border-b p-2 text-left last:border-r-0 sm:min-h-28",
                day.currentMonth ? "bg-background" : "bg-muted/20",
                day.selected
                  ? "ring-ring relative z-10 ring-2 ring-inset"
                  : "hover:bg-accent/40",
              ].join(" ")}
            >
              <div
                className={[
                  "flex size-7 items-center justify-center rounded-full text-sm",
                  day.today
                    ? "bg-primary text-primary-foreground font-semibold"
                    : day.currentMonth
                      ? "text-foreground"
                      : "text-muted-foreground",
                ].join(" ")}
              >
                {day.date.getDate()}
              </div>

              <div className="mt-2 space-y-1">
                {day.events.map((event) => (
                  <div
                    key={event.title}
                    className="bg-secondary text-secondary-foreground truncate rounded-sm px-2 py-1 text-xs"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-border grid gap-4 rounded-md border p-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold tracking-normal">
                {formatReadableDate(selectedDate)} 일정
              </h3>
              <p className="text-muted-foreground text-sm">
                날짜를 누르면 해당 날짜에 일정을 추가할 수 있습니다.
              </p>
            </div>
          </div>

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-2">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-muted/30 flex items-start justify-between gap-3 rounded-md p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium">{event.title}</p>
                    {event.memo ? (
                      <p className="text-muted-foreground text-sm">
                        {event.memo}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEvent(event.id)}
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground bg-muted/20 rounded-md p-4 text-sm">
              아직 등록된 일정이 없습니다.
            </div>
          )}
        </div>

        <form
          className="bg-muted/20 space-y-3 rounded-md p-4"
          onSubmit={(event) => {
            event.preventDefault();
            addEvent();
          }}
        >
          <div className="space-y-1">
            <label htmlFor="event-date" className="text-sm font-medium">
              날짜
            </label>
            <input
              id="event-date"
              type="date"
              value={selectedDate}
              onChange={(event) => openDate(event.target.value)}
              className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="event-title" className="text-sm font-medium">
              일정명
            </label>
            <input
              id="event-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 청첩장 샘플 확인"
              className="border-input bg-background focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="event-memo" className="text-sm font-medium">
              메모
            </label>
            <textarea
              id="event-memo"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              placeholder="필요한 내용을 적어두세요."
              rows={3}
              className="border-input bg-background focus-visible:ring-ring/50 min-h-24 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={!title.trim()}>
            <Plus className="size-4" aria-hidden="true" />
            일정 추가
          </Button>
        </form>
      </div>
    </section>
  );
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function formatReadableDate(dateKey: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(parseDateKey(dateKey));
}
