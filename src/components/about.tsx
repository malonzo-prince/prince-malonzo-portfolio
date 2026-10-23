import { ArrowUpRight, Braces, GraduationCap, Layers3, Smartphone } from "lucide-react";
import { profile } from "@/content/portfolio";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const capabilities = [
  {
    icon: Braces,
    title: "From front to back",
    text: "Interfaces, APIs, authentication, and the systems that connect them.",
  },
  {
    icon: Smartphone,
    title: "Across screens",
    text: "Responsive websites and mobile applications designed around people.",
  },
  {
    icon: Layers3,
    title: "Beyond the build",
    text: "Testing, deployment, collaboration, and the details that make software work.",
  },
];

export function About() {
  return (
    <section id="about" className="section section-anchor about-section">
      <div className="container">
        <div className="about-grid">
          <Reveal>
            <SectionHeading
              number="01"
              label="A little about me"
              title={
                <>
                  Curiosity is where
                  <br />
                  it all starts<span className="accent">.</span>
                </>
              }
            />
            <div className="education-note">
              <GraduationCap size={19} />
              <span>
                BS Information Technology
                <br />
                <strong>Magna Cum Laude, Class of 2026</strong>
              </span>
            </div>
          </Reveal>
          <Reveal className="about-story">
            <p className="about-lead">
              I like understanding how things work.
              <br />
              <span>Then making them work better.</span>
            </p>
            <p>
              I’m Prince, a Full Stack Developer based in Manila. My background spans web and mobile
              applications, with hands-on experience translating requirements into interfaces,
              backend features, and working systems.
            </p>
            <p>
              I graduated from National University–Mall of Asia with a specialization in Mobile and
              Web Applications. Along the way, I’ve worked on internal and client projects, used
              AI-powered development tools, supported API integrations, deployment, and QA, and
              coordinated a team of 17 interns.
            </p>
            <p>
              What I enjoy most is connecting the pieces: a useful idea, a considered interface, and
              the logic that brings it all together.
            </p>
            <a className="text-link" href={profile.resume} download>
              Get to know my background
              <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </div>
        <Reveal className="capabilities">
          {capabilities.map(({ icon: Icon, title, text }, i) => (
            <div className="capability" key={title}>
              <span className="capability-icon">
                <Icon size={23} strokeWidth={1.5} />
              </span>
              <span className="mono capability-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
