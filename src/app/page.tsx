import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { GitHubActivity } from "@/components/github-activity";
import { Skills } from "@/components/skills";
import { RequestLab } from "@/components/request-lab";
import { Experience } from "@/components/experience";
import { Credentials } from "@/components/credentials";
import { ProjectBlueprint } from "@/components/project-blueprint";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { profile } from "@/content/portfolio";
import { getSiteUrl } from "@/lib/site";
import { getGitHubCalendar } from "@/lib/github";

export const revalidate = 3600;

export default async function Home() {
  const calendar = await getGitHubCalendar();
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: getSiteUrl(),
    image: `${getSiteUrl()}/images/prince-malonzo.png`,
    sameAs: [profile.github, profile.linkedin],
    alumniOf: { "@type": "CollegeOrUniversity", name: "National University – Mall of Asia" },
    address: { "@type": "PostalAddress", addressLocality: "Manila", addressCountry: "PH" },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replaceAll("<", "\\u003c") }}
      />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <GitHubActivity calendar={calendar} />
        <Skills />
        <RequestLab />
        <Experience />
        <Credentials />
        <ProjectBlueprint />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
