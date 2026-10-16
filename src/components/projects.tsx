"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Github } from "@/components/brand-icons";
import { profile, projects } from "@/content/portfolio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const filters = ["All work", "Web", "Mobile"] as const;

export function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All work");
  const visible = projects.filter(
    (project) => filter === "All work" || project.category === filter,
  );
  const hasConcepts = projects.some((project) => project.status === "concept");
  return (
    <section id="projects" className="section section-anchor projects-section">
      <div className="container">
        <Reveal className="section-top-row">
          <SectionHeading
            number="02"
            label="Selected work"
            title={
              <>
                Ideas, made tangible<span className="accent">.</span>
              </>
            }
            description="A closer look at interfaces, experiences, and the thinking behind them."
          />
          <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">
            Explore GitHub
            <ArrowUpRight size={17} />
          </a>
        </Reveal>
        <div className="project-toolbar">
          <div className="filter-group" role="group" aria-label="Filter projects">
            {filters.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "filter-button selected" : "filter-button"}
                onClick={() => setFilter(item)}
              >
                {item}
                {item === "All work" && <span>{projects.length.toString().padStart(2, "0")}</span>}
              </button>
            ))}
          </div>
          {hasConcepts && (
            <span className="concept-note">
              <span />
              Sample concepts · Real case studies coming next
            </span>
          )}
        </div>
        <div className="project-grid" aria-live="polite">
          {visible.map((project) => (
            <Reveal key={project.id} className={`project-card project-${project.kind}`}>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="project-card-trigger"
                    aria-label={`Explore ${project.name}${project.status === "concept" ? ", sample concept" : ""}`}
                  >
                    <div className="project-image-wrap">
                      {project.status === "published" && project.image ? (
                        <Image
                          src={project.image}
                          alt={`${project.name} screenshot`}
                          width={1200}
                          height={800}
                          sizes="(max-width: 767px) 100vw, 50vw"
                          className="published-project-image"
                        />
                      ) : (
                        <ProjectVisual kind={project.kind} />
                      )}
                      <span className="project-status">
                        {project.status === "concept" ? "CONCEPT PREVIEW" : "CASE STUDY"}
                      </span>
                      <span className="project-open">
                        <ArrowUpRight size={21} />
                      </span>
                    </div>
                    <div className="project-card-info">
                      <div className="project-category mono">
                        <span>
                          {project.number} /{" "}
                          {project.category === "Mobile" ? "MOBILE EXPERIENCE" : "WEB APPLICATION"}
                        </span>
                        <ArrowUpRight size={18} />
                      </div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <div className="project-stack">
                        {project.stack.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="project-dialog">
                  <div className="project-dialog-visual">
                    {project.status === "published" && project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.name} screenshot`}
                        width={1200}
                        height={800}
                        sizes="(max-width: 767px) 100vw, 800px"
                      />
                    ) : (
                      <ProjectVisual kind={project.kind} />
                    )}
                  </div>
                  <div className="project-dialog-copy">
                    <p className="eyebrow">
                      {project.status === "concept" ? "Sample concept" : "Project case study"} /{" "}
                      {project.category}
                    </p>
                    <DialogTitle className="project-dialog-title">{project.name}</DialogTitle>
                    <DialogDescription className="project-dialog-description">
                      {project.description}
                    </DialogDescription>
                    {project.status === "concept" ? (
                      <p className="project-disclosure">
                        This is an illustrative project concept and interface preview. It is not a
                        completed project or client engagement. A real case study will take its
                        place.
                      </p>
                    ) : (
                      project.contribution && <p>{project.contribution}</p>
                    )}
                    <h4>
                      {project.status === "concept" ? "Suggested technologies" : "Technology stack"}
                    </h4>
                    <div className="project-stack">
                      {project.stack.map((technology) => (
                        <span key={technology}>{technology}</span>
                      ))}
                    </div>
                    <div className="project-dialog-links">
                      {project.repository && (
                        <Button asChild variant="outline">
                          <a href={project.repository} target="_blank" rel="noopener noreferrer">
                            <Github size={16} />
                            Source code
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            Visit project
                            <ArrowUpRight size={16} />
                          </a>
                        </Button>
                      )}
                      {project.status === "concept" && (
                        <Button asChild variant="outline">
                          <a href={profile.github} target="_blank" rel="noopener noreferrer">
                            <Github size={16} />
                            Explore my GitHub
                            <ArrowUpRight size={16} />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
