import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Github, Linkedin } from "@/components/brand-icons";
import { profile } from "@/content/portfolio";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

export function Contact() {
  return (
    <section id="contact" className="section section-anchor contact-section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">
            <span>06</span>
            <span className="eyebrow-line" />
            Let’s connect
          </p>
          <div className="contact-title-row">
            <h2>
              Good things start
              <br />
              with <span>a conversation.</span>
            </h2>
            <span className="contact-arrow" aria-hidden="true">
              <ArrowUpRight strokeWidth={0.8} />
            </span>
          </div>
        </Reveal>
        <div className="contact-grid">
          <Reveal className="contact-details">
            <p>
              I’m open to freelance web and mobile projects. Have an idea, an opportunity to share,
              or something you’d like to build? I’d love to hear about it.
            </p>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              <span className="contact-detail-label">
                <Mail size={15} />
                Drop me a line
              </span>
              <span>
                {profile.email}
                <ArrowUpRight size={18} />
              </span>
            </a>
            <div className="contact-location">
              <span className="contact-detail-label">
                <MapPin size={15} />
                Based in
              </span>
              <span>
                Manila, Philippines<span className="mono">GMT+8</span>
              </span>
            </div>
            <div className="contact-socials">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                <Github size={18} />
                GitHub
                <ArrowUpRight size={15} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} />
                LinkedIn
                <ArrowUpRight size={15} />
              </a>
            </div>
          </Reveal>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
