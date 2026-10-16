import Image from "next/image";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Download, MapPin } from "lucide-react";
import { Github, Linkedin } from "@/components/brand-icons";
import { profile } from "@/content/portfolio";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section id="home" className="hero section-anchor" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-meta">
          <span className="eyebrow">
            <span className="status-dot" />
            Full Stack Developer
          </span>
          <span className="hero-location mono">
            <MapPin size={13} />
            Manila, Philippines
          </span>
        </div>
        <div className="hero-grid">
          <Reveal className="hero-copy">
            <p className="hero-intro">Hi there, I’m</p>
            <h1 id="hero-title">
              Prince Barachiel
              <br />
              <span>
                Malonzo<span className="accent">.</span>
              </span>
            </h1>
            <p className="hero-statement">
              Thoughtful interfaces.
              <br />
              Reliable systems. <span>Built together.</span>
            </p>
            <p className="hero-description">
              I build web and mobile applications, bringing ideas to life from the first interaction
              to the last line of backend code.
            </p>
            <div className="hero-buttons">
              <Button asChild>
                <a href="#projects">
                  Explore my work <ArrowDownRight size={18} />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={profile.resume} download>
                  Download CV <Download size={16} />
                </a>
              </Button>
            </div>
            <a href="/#project-builder" className="freelance-badge">
              <span className="status-dot" />
              {profile.availability}
              <ArrowUpRight size={14} />
            </a>
            <div className="hero-socials">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                <Github size={16} />
                GitHub
                <ArrowUpRight size={13} />
              </a>
              <span />
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} />
                LinkedIn
                <ArrowUpRight size={13} />
              </a>
            </div>
          </Reveal>
          <Reveal className="hero-visual" delay={0.1}>
            <div className="portrait-stage">
              <div className="portrait-topline">
                <span className="mono">THE PERSON BEHIND THE CODE</span>
                <span className="portrait-cross" aria-hidden="true">
                  +
                </span>
              </div>
              <span className="portrait-brace portrait-brace-left" aria-hidden="true">
                &#123;
              </span>
              <span className="portrait-brace portrait-brace-right" aria-hidden="true">
                &#125;
              </span>
              <div className="portrait-frame">
                <Image
                  src="/images/prince-malonzo.png"
                  alt="Prince Barachiel Malonzo"
                  width={240}
                  height={240}
                  sizes="(max-width: 480px) 220px, 280px"
                  priority
                  className="portrait-image"
                />
              </div>
              <div className="portrait-caption">
                <span className="portrait-caption-line" />
                <span className="mono">
                  A LITTLE LOGIC.
                  <br />A LOT OF CURIOSITY.
                </span>
              </div>
              <div className="portrait-stamp" aria-label="Web and mobile development">
                <span>WEB +</span>
                <span>MOBILE</span>
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="hero-visual-footer">
              <span className="mono">IDEA → INTERFACE → IMPACT</span>
              <span className="mono">&lt;/&gt;</span>
            </div>
          </Reveal>
        </div>
        <div className="hero-bottom">
          <a href="#about" className="discover-link">
            <span className="discover-icon">
              <ArrowDown size={14} />
            </span>
            There’s more below
          </a>
          <span className="mono hero-bottom-note">CRAFTED WITH PURPOSE. BUILT WITH CARE.</span>
        </div>
      </div>
    </section>
  );
}
