import assert from "node:assert/strict";
import { test } from "node:test";
import {
  dateInZone,
  getMeetingSlots,
  MANILA_TIME_ZONE,
  meetingBrief,
  meetingCalendar,
  meetingTime,
} from "../src/lib/meetings";

test("New York daylight-saving gaps and repeated hours produce real, distinct meeting instants", () => {
  const day = { timeZone: "America/New_York", fromHour: 0, toHour: 24, now: 0 };
  const spring = getMeetingSlots({ ...day, date: "2026-03-08" });
  assert.equal(spring.length, 46);
  assert.equal(
    spring.some((slot) => /^2:.*AM$/.test(meetingTime(slot.start, day.timeZone))),
    false,
  );
  const fall = getMeetingSlots({ ...day, date: "2026-11-01" });
  assert.equal(fall.length, 50);
  const repeated = fall.filter((slot) => meetingTime(slot.start, day.timeZone) === "1:00 AM");
  assert.equal(repeated.length, 2);
  assert.notEqual(
    meetingTime(repeated[0].start, day.timeZone, true),
    meetingTime(repeated[1].start, day.timeZone, true),
  );
  assert.equal(repeated[1].start - repeated[0].start, 3_600_000);
});

test("fractional-offset zones, Manila date rollover, durations, and past filtering stay correct", () => {
  const slots = getMeetingSlots({
    date: "2026-10-17",
    timeZone: "Asia/Kathmandu",
    fromHour: 9,
    toHour: 10,
    now: 0,
  });
  assert.equal(slots.length, 2);
  assert.equal(new Date(slots[0].start).toISOString(), "2026-10-17T03:15:00.000Z");
  const us = getMeetingSlots({
    date: "2026-10-17",
    timeZone: "America/Los_Angeles",
    fromHour: 18,
    toHour: 20,
    durationMinutes: 60,
    now: 0,
  });
  assert.equal(us.length, 3);
  assert.equal(dateInZone(us[0].start, MANILA_TIME_ZONE), "2026-10-18");
  assert.ok(us.every((slot) => slot.end - slot.start === 3_600_000));
  assert.equal(
    getMeetingSlots({
      date: "2026-10-17",
      timeZone: "UTC",
      fromHour: 9,
      toHour: 10,
      now: Date.parse("2026-10-17T09:00:00Z"),
    }).length,
    1,
  );
  assert.equal(getMeetingSlots({ date: "2026-02-31", timeZone: "UTC", now: 0 }).length, 0);
  assert.equal(getMeetingSlots({ date: "2026-10-17", timeZone: "Unknown/Zone", now: 0 }).length, 0);
});

test("calendar reminders use UTC, preserve exact instants, and remain tentative without inviting anyone", () => {
  const slot = {
    start: Date.parse("2026-10-17T18:00:00Z"),
    end: Date.parse("2026-10-17T18:30:00Z"),
  };
  const calendar = meetingCalendar(
    slot,
    "America/New_York",
    "Prince, Malonzo;\nA".repeat(6),
    Date.parse("2026-10-16T08:00:00Z"),
  );
  assert.match(calendar, /DTSTART:20261017T180000Z\r\nDTEND:20261017T183000Z/);
  assert.match(calendar, /STATUS:TENTATIVE\r\nTRANSP:TRANSPARENT/);
  assert.doesNotMatch(calendar, /ATTENDEE|ORGANIZER|METHOD:REQUEST/);
  assert.ok(calendar.split("\r\n").every((line) => new TextEncoder().encode(line).length <= 75));
  assert.match(calendar.replaceAll("\r\n ", ""), /Prince\\, Malonzo\\;\\nA/);
  assert.match(meetingBrief(slot, "America/New_York"), /Manila time:.*Oct 18, 2026/);
});
