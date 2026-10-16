"use client";

import { useState } from "react";
import {
  Braces,
  Cloud,
  Code2,
  Database,
  GitBranch,
  LayoutTemplate,
  Network,
  PenTool,
  Server,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from "lucide-react";
import { skillFilters, skillGroups, type SkillFilter } from "@/content/portfolio";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const icons = {
  code: Code2,
  layout: LayoutTemplate,
  server: Server,
  shield: ShieldCheck,
  database: Database,
  cloud: Cloud,
  network: Network,
  git: GitBranch,
  check: TestTube2,
  sparkles: Sparkles,
  pen: PenTool,
};

export function Skills() {
  const [filter, setFilter] = useState<SkillFilter>("All skills");
  const [expanded, setExpanded] = useState(false);
  const filtered = skillGroups.filter(
    (group) => filter === "All skills" || group.category === filter,
  );
  const visible = filter === "All skills" && !expanded ? filtered.slice(0, 6) : filtered;
  return (
    <section id="skills" className="section section-anchor skills-section">
      <div className="container">
        <Reveal className="section-top-row">
          <SectionHeading
            number="03"
            label="The toolkit"
            title={
              <>
                The right tools.
                <br />A thoughtful approach<span className="accent">.</span>
              </>
            }
            description="Technologies I work with across the development process, from a first prototype to deployment."
          />
          <div className="skills-symbol" aria-hidden="true">
            <Braces size={72} strokeWidth={0.8} />
          </div>
        </Reveal>
        <div
          className="filter-group skills-filters"
          role="group"
          aria-label="Filter technical skills"
        >
          {skillFilters.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={filter === item}
              className={filter === item ? "filter-button selected" : "filter-button"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="skills-grid" aria-live="polite">
          {visible.map((group) => {
            const Icon = icons[group.icon as keyof typeof icons];
            return (
              <div className="skill-group" key={group.name}>
                <div className="skill-group-title">
                  <span className="skill-icon">
                    <Icon size={19} strokeWidth={1.5} />
                  </span>
                  <h3>{group.name}</h3>
                </div>
                <ul className="skill-tags">
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {filter === "All skills" && (
          <div className="skills-expand">
            <button
              type="button"
              className="text-link"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? "Show a little less" : "Explore the full toolkit"}
              <span aria-hidden="true">{expanded ? "−" : "+"}</span>
            </button>
            <span className="mono">
              {expanded ? skillGroups.length : 6} / {skillGroups.length} CATEGORIES
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
