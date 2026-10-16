"use client";

import { useId, useState } from "react";
import {
  calendarWeeks,
  type ContributionCalendar,
  type ContributionDay,
} from "@/lib/github-calendar";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const monthFormatter = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
const describe = (day: ContributionDay) =>
  `${day.count.toLocaleString()} ${day.count === 1 ? "contribution" : "contributions"} on ${dateFormatter.format(new Date(`${day.date}T00:00:00Z`))}`;

export function GitHubGraph({ calendar }: { calendar: ContributionCalendar }) {
  const weeks = calendarWeeks(calendar.days);
  const [selected, setSelected] = useState<ContributionDay | null>(null);
  const [focus, setFocus] = useState(calendar.days.at(-1)?.date);
  const id = useId();
  const months = weeks.map((week, index) => {
    const day = week.find(Boolean);
    if (!day) return "";
    const date = new Date(`${day.date}T00:00:00Z`);
    const previousDay = weeks[index - 1]?.find(Boolean);
    if (
      previousDay &&
      date.getUTCMonth() === new Date(`${previousDay.date}T00:00:00Z`).getUTCMonth()
    )
      return "";
    return monthFormatter.format(date);
  });
  function moveFocus(event: React.KeyboardEvent<HTMLButtonElement>, day: ContributionDay) {
    const delta = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[event.key];
    if (!delta && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const index = calendar.days.findIndex((item) => item.date === day.date);
    const next =
      event.key === "Home"
        ? calendar.days[0]
        : event.key === "End"
          ? calendar.days.at(-1)
          : calendar.days[Math.max(0, Math.min(calendar.days.length - 1, index + (delta ?? 0)))];
    if (next) {
      setFocus(next.date);
      document.getElementById(`${id}-${next.date}`)?.focus({ preventScroll: true });
    }
  }
  return (
    <div className="contribution-calendar">
      <p className="sr-only" id={`${id}-instructions`}>
        GitHub contributions in the last year. Use arrow keys to explore days. Home selects the
        first day; End selects the last.
      </p>
      <div
        className="calendar-scroll"
        role="region"
        aria-label="GitHub contribution calendar"
        tabIndex={0}
      >
        <div className="calendar-inner" style={{ "--weeks": weeks.length } as React.CSSProperties}>
          <div className="calendar-months" aria-hidden="true">
            <span />
            {months.map((month, i) => (
              <span key={i}>{month}</span>
            ))}
          </div>
          <div className="calendar-chart" aria-describedby={`${id}-instructions`}>
            <div className="calendar-weekdays" aria-hidden="true">
              <span />
              <span>Mon</span>
              <span />
              <span>Wed</span>
              <span />
              <span>Fri</span>
              <span />
            </div>
            {weeks.map((week, index) => (
              <div className="calendar-week" key={index}>
                {week.map((day, dayIndex) =>
                  day ? (
                    <button
                      key={day.date}
                      id={`${id}-${day.date}`}
                      type="button"
                      className={`contribution-day contribution-level-${day.level}`}
                      title={describe(day)}
                      aria-label={describe(day)}
                      tabIndex={focus === day.date ? 0 : -1}
                      onMouseEnter={() => setSelected(day)}
                      onMouseLeave={() => setSelected(null)}
                      onFocus={() => {
                        setFocus(day.date);
                        setSelected(day);
                      }}
                      onBlur={() => setSelected(null)}
                      onClick={() => setSelected(day)}
                      onKeyDown={(event) => moveFocus(event, day)}
                    />
                  ) : (
                    <span key={`blank-${dayIndex}`} className="contribution-blank" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="calendar-footer">
        <span className="calendar-detail" role="status" aria-live="polite">
          {selected ? describe(selected) : "Little green squares. A bigger picture."}
        </span>
        <div className="calendar-legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} className={`contribution-day contribution-level-${level}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
