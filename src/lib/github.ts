import "server-only";
import { profile } from "@/content/portfolio";
import {
  parsePublicCalendar,
  type ContributionCalendar,
  type ContributionDay,
} from "@/lib/github-calendar";

const levels: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchGraphQL(token: string): Promise<ContributionCalendar> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "MalonzoPortfolio",
    },
    body: JSON.stringify({
      query:
        "query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}",
      variables: { login: profile.githubUsername },
    }),
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("GitHub API request failed.");
  const json = await response.json();
  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (json.errors || !calendar?.weeks?.length) throw new Error("GitHub API returned no calendar.");
  const days: ContributionDay[] = calendar.weeks.flatMap(
    (week: {
      contributionDays: { date: string; contributionCount: number; contributionLevel: string }[];
    }) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levels[day.contributionLevel] ?? 0,
      })),
  );
  return {
    days,
    total: calendar.totalContributions,
    fetchedAt: new Date().toISOString(),
    source: "github-api",
  };
}

export async function getGitHubCalendar(): Promise<ContributionCalendar | null> {
  if (process.env.GITHUB_TOKEN) {
    try {
      return await fetchGraphQL(process.env.GITHUB_TOKEN);
    } catch {
      /* Fall back to the same public calendar visitors can see. */
    }
  }
  try {
    const response = await fetch(
      `https://github.com/users/${profile.githubUsername}/contributions`,
      {
        headers: { "User-Agent": "MalonzoPortfolio", Accept: "text/html" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return null;
    return parsePublicCalendar(await response.text());
  } catch {
    return null;
  }
}
