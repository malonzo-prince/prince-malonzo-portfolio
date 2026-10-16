export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type ContributionCalendar = {
  days: ContributionDay[];
  total: number;
  fetchedAt: string;
  source: "github-public" | "github-api";
};

function attribute(tag: string, name: string) {
  return tag.match(new RegExp(`(?:^|\\s)${name}=["']([^"']*)["']`))?.[1];
}

/** Parse only dates, counts, and intensity levels, never render upstream HTML. */
export function parsePublicCalendar(html: string): ContributionCalendar {
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attribute(match[1], "for");
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    const count = text.match(/^([\d,]+)\s+contributions?\b/i);
    if (id && (count || /^No contributions\b/i.test(text)))
      counts.set(id, count ? Number(count[1].replaceAll(",", "")) : 0);
  }
  const byDate = new Map<string, ContributionDay>();
  for (const match of html.matchAll(/<td\b[^>]*\bdata-date=["'][^"']+["'][^>]*>/g)) {
    const tag = match[0];
    const date = attribute(tag, "data-date");
    const rawLevel = attribute(tag, "data-level");
    const id = attribute(tag, "id");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !rawLevel || !/^[0-4]$/.test(rawLevel))
      continue;
    const count = id ? counts.get(id) : undefined;
    if (count === undefined) throw new Error("GitHub contribution counts could not be read.");
    byDate.set(date, { date, count, level: Number(rawLevel) as ContributionDay["level"] });
  }
  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 300 || days.length > 371)
    throw new Error("GitHub returned an incomplete contribution calendar.");
  return {
    days,
    total: days.reduce((sum, day) => sum + day.count, 0),
    fetchedAt: new Date().toISOString(),
    source: "github-public",
  };
}

export function calendarWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  if (!days.length) return [];
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const cells: (ContributionDay | null)[] = [...Array<null>(offset).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}
