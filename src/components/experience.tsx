"use client";

import { BriefcaseBusiness } from "lucide-react";
import { experience } from "@/content/portfolio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Experience() {
  return (
    <section id="experience" className="section section-anchor experience-section">
      <div className="container experience-grid">
        <Reveal>
          <SectionHeading
            number="04"
            label="The journey so far"
            title={
              <>
                Learning by doing.
                <br />
                Growing by building<span className="accent">.</span>
              </>
            }
            description="Each role has brought a new perspective, a different challenge, and something worth learning."
          />
          <div className="experience-aside">
            <BriefcaseBusiness size={18} />
            <span>Development · Collaboration · Delivery</span>
          </div>
        </Reveal>
        <Reveal>
          <Accordion
            type="multiple"
            defaultValue={[experience[0].id]}
            className="experience-timeline"
          >
            {experience.map((item, index) => (
              <AccordionItem value={item.id} className="experience-item" key={item.id}>
                <span className={`timeline-node${index === 0 ? " timeline-node-active" : ""}`} />
                <AccordionTrigger>
                  <span className="experience-heading">
                    <span className="experience-period mono">
                      <time dateTime={item.dateTime}>{item.period}</time>
                    </span>
                    <span className="experience-role">{item.role}</span>
                    <span className="experience-company">
                      {item.company}
                      <span className="experience-type">{item.type}</span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p>{item.summary}</p>
                  <ul>
                    {item.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
