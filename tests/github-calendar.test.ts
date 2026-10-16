import assert from "node:assert/strict";
import { test } from "node:test";
import { calendarWeeks, parsePublicCalendar } from "../src/lib/github-calendar";

function fixture() {
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date(Date.UTC(2025, 9, 16 + i)).toISOString().slice(0, 10);
    const count = i === 4 ? "1,204 contributions" : i === 0 ? "1 contribution" : "No contributions";
    return `<td tabindex="0" data-date="${date}" id="day-${i}" data-level="${i === 4 ? 4 : i === 0 ? 1 : 0}" class="ContributionCalendar-day"></td><tool-tip for="day-${i}" class="sr-only">${count} on October 16th.</tool-tip>`;
  })
    .reverse()
    .join("\n");
}

test("GitHub calendar pairs tooltips with dates, sorts chronologically, and handles comma-separated counts", () => {
  const calendar = parsePublicCalendar(fixture());
  assert.equal(calendar.days.length, 365);
  assert.equal(calendar.days[0].date, "2025-10-16");
  assert.equal(calendar.days[0].count, 1);
  assert.equal(calendar.days[4].count, 1204);
  assert.equal(calendar.days[4].level, 4);
  assert.equal(calendar.total, 1205);
});

test("upstream markup changes never silently produce made-up activity", () => {
  assert.throws(() => parsePublicCalendar("<p>GitHub is unavailable.</p>"));
  assert.throws(() => parsePublicCalendar(fixture().replace('for="day-0"', 'for="unrelated"')));
});

test("week layout aligns dates to UTC weekdays and keeps every day once", () => {
  const calendar = parsePublicCalendar(fixture());
  const weeks = calendarWeeks(calendar.days);
  assert.equal(
    weeks[0].slice(0, 4).every((day) => day === null),
    true,
  );
  assert.equal(weeks[0][4]?.date, "2025-10-16");
  assert.equal(weeks.flat().filter(Boolean).length, 365);
  assert.equal(
    weeks.every((week) => week.length === 7),
    true,
  );
  assert.deepEqual(calendarWeeks([]), []);
});
