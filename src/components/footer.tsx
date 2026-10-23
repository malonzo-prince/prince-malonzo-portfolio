import { ArrowUp } from "lucide-react";
import { profile } from "@/content/portfolio";
import { Brand, ThemeToggle } from "@/components/header";

export function Footer() {
  const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Manila" }).format(
    new Date(),
  );
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Brand footer />
          <nav aria-label="Footer navigation">
            <a href="#about">About</a>
            <a href="#projects">Work</a>
            <a href="#experience">Experience</a>
            <a href="#client-stories">Client stories</a>
            <a href="/#project-builder">Project builder</a>
            <a href={profile.resume} download>
              Resume
            </a>
          </nav>
          <a href="#home" className="back-to-top">
            Back to top
            <ArrowUp size={15} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>© {year} Prince Barachiel Malonzo</p>
          <span>Made with intention, in Manila.</span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
