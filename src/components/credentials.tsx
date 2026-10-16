import { Award, BadgeCheck, GraduationCap, MoveUpRight } from "lucide-react";
import Image from "next/image";
import { certifications } from "@/content/portfolio";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Credentials() {
  return (
    <section id="education" className="section section-anchor credentials-section">
      <div className="container">
        <Reveal>
          <SectionHeading
            number="05"
            label="A strong foundation"
            title={
              <>
                Always a student
                <br />
                of the craft<span className="accent">.</span>
              </>
            }
          />
        </Reveal>
        <div className="credentials-grid">
          <Reveal className="education-card">
            <div className="credential-card-top">
              <span className="eyebrow">Education</span>
              <GraduationCap size={24} strokeWidth={1.4} />
            </div>
            <span className="mono education-period">JULY 2022 — JULY 2026</span>
            <h3>
              Bachelor of Science
              <br />
              in Information Technology
            </h3>
            <p className="education-specialization">
              Specialization in Mobile and Web Applications
            </p>
            <div className="education-university">
              <Image
                src="/images/national-university-logo.webp"
                alt="National University Philippines logo"
                width={40}
                height={48}
                className="university-logo"
              />
              <div>
                <strong>National University</strong>
                <span>Mall of Asia, Philippines</span>
              </div>
              <MoveUpRight size={19} aria-hidden="true" />
            </div>
            <div className="honors">
              <Award size={18} />
              <span>Magna Cum Laude</span>
              <span className="mono">CLASS OF 2026</span>
            </div>
          </Reveal>
          <Reveal className="certification-column">
            <div id="certifications" className="credential-card-top section-anchor">
              <span className="eyebrow">Professional certifications</span>
              <BadgeCheck size={23} strokeWidth={1.4} />
            </div>
            {certifications.map((certification) => (
              <article className="certification" key={certification.subject}>
                <span className="certification-number mono">{certification.number}</span>
                <div>
                  <p>{certification.title}</p>
                  <h3>{certification.subject}</h3>
                  <span className="certification-issuer">{certification.issuer}</span>
                  <time dateTime="2026-04" className="mono">
                    {certification.date}
                  </time>
                </div>
                <BadgeCheck className="certification-check" size={23} strokeWidth={1.5} />
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
