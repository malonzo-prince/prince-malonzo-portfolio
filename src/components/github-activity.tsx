import { ArrowUpRight } from "lucide-react";
import { Github } from "@/components/brand-icons";
import { profile } from "@/content/portfolio";
import type { ContributionCalendar } from "@/lib/github-calendar";
import { GitHubGraph } from "@/components/github-graph";
import { Reveal } from "@/components/reveal";

export function GitHubActivity({ calendar }: { calendar: ContributionCalendar | null }) {
  return (
    <section id="github" className="section-anchor github-section">
      <div className="container">
        <Reveal className="github-panel">
          <div className="github-header">
            <div className="github-intro">
              <span className="github-icon">
                <Github size={25} strokeWidth={1.5} />
              </span>
              <div>
                <p className="eyebrow">Behind the commits</p>
                <h2>
                  Building, one day at a time<span className="accent">.</span>
                </h2>
              </div>
            </div>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{profile.githubUsername}
              <ArrowUpRight size={16} />
            </a>
          </div>
          {calendar ? (
            <>
              <div className="github-summary">
                <span>
                  <strong>{calendar.total.toLocaleString()}</strong> contributions in the last year
                </span>
                <span className="github-live">
                  <span className="status-dot" />
                  Public GitHub activity
                </span>
              </div>
              <GitHubGraph calendar={calendar} />
              <p className="github-source">
                From the contribution activity visible on my GitHub profile. Refreshed hourly.
              </p>
            </>
          ) : (
            <div className="github-unavailable">
              <p>My activity calendar is taking a short break.</p>
              <a
                href={profile.github}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                See the latest on GitHub
                <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
