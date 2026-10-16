export const MANILA_TIME_ZONE = "Asia/Manila";
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

export type MeetingSlot = { start: number; end: number };

function dateParts(formatter: Intl.DateTimeFormat, timestamp: number) {
  const parts = Object.fromEntries(
    formatter.formatToParts(timestamp).map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour || 0) * 60 + Number(parts.minute || 0),
  };
}

export function dateInZone(timestamp: number, timeZone: string) {
  return dateParts(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    timestamp,
  ).date;
}

export function meetingTime(timestamp: number, timeZone: string, includeOffset = false) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    ...(includeOffset ? { timeZoneName: "shortOffset" as const } : {}),
  }).format(timestamp);
}

export function meetingDateTime(timestamp: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "shortOffset",
  }).format(timestamp);
}

/** Walk real instants so DST gaps and repeated hours stay unambiguous. */
export function getMeetingSlots({
  date,
  timeZone,
  fromHour = 9,
  toHour = 18,
  durationMinutes = 30,
  now = Date.now(),
}: {
  date: string;
  timeZone: string;
  fromHour?: number;
  toHour?: number;
  durationMinutes?: number;
  now?: number;
}): MeetingSlot[] {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(now) ||
    ![30, 60].includes(durationMinutes) ||
    !Number.isInteger(fromHour) ||
    !Number.isInteger(toHour) ||
    fromHour < 0 ||
    toHour > 24 ||
    fromHour >= toHour
  )
    return [];
  const midnight = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(midnight) || new Date(midnight).toISOString().slice(0, 10) !== date)
    return [];
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  } catch {
    return [];
  }
  const nextDate = new Date(midnight + 24 * HOUR).toISOString().slice(0, 10);
  const slots: MeetingSlot[] = [];
  for (let start = midnight - 16 * HOUR; start < midnight + 40 * HOUR; start += 15 * MINUTE) {
    if (start <= now) continue;
    const localStart = dateParts(formatter, start);
    if (
      localStart.date !== date ||
      localStart.minutes % 30 !== 0 ||
      localStart.minutes < fromHour * 60 ||
      localStart.minutes >= toHour * 60
    )
      continue;
    const end = start + durationMinutes * MINUTE;
    const localEnd = dateParts(formatter, end);
    const endsWithinWindow =
      localEnd.date === date &&
      localEnd.minutes <= toHour * 60 &&
      localEnd.minutes >= fromHour * 60;
    const endsAtMidnight = toHour === 24 && localEnd.date === nextDate && localEnd.minutes === 0;
    if (endsWithinWindow || endsAtMidnight) slots.push({ start, end });
  }
  return slots;
}

export function meetingBrief(slot: MeetingSlot, timeZone: string) {
  return [
    "Meeting request",
    `My time: ${meetingDateTime(slot.start, timeZone)}`,
    `My timezone: ${timeZone}`,
    `Manila time: ${meetingDateTime(slot.start, MANILA_TIME_ZONE)}`,
    `Duration: ${(slot.end - slot.start) / MINUTE} minutes`,
    "Please confirm whether this time works. I'd like to discuss:",
  ].join("\n");
}

function calendarText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("\r", "")
    .replaceAll("\n", "\\n")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,");
}

/** Fold UTF-8 content lines at 75 octets, as required by iCalendar. */
function foldCalendarLine(line: string) {
  const encoder = new TextEncoder();
  const lines: string[] = [];
  let current = "";
  let bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      lines.push(current);
      current = " ";
      bytes = 1;
    }
    current += character;
    bytes += size;
  }
  lines.push(current);
  return lines.join("\r\n");
}

export function meetingCalendar(
  slot: MeetingSlot,
  timeZone: string,
  person: string,
  now = Date.now(),
) {
  const utc = (timestamp: number) =>
    new Date(timestamp)
      .toISOString()
      .replaceAll("-", "")
      .replaceAll(":", "")
      .replace(/\.\d{3}Z$/, "Z");
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Prince Malonzo//Meeting Planner//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${slot.start}-${slot.end}@pmalonzo-portfolio.vercel.app`,
      `DTSTAMP:${utc(now)}`,
      `DTSTART:${utc(slot.start)}`,
      `DTEND:${utc(slot.end)}`,
      `SUMMARY:${calendarText(`Proposed meeting with ${person}`)}`,
      `DESCRIPTION:${calendarText(`${meetingBrief(slot, timeZone)}\n\nThis is a proposed time, awaiting confirmation by email.`)}`,
      "STATUS:TENTATIVE",
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(foldCalendarLine)
      .join("\r\n") + "\r\n"
  );
}
