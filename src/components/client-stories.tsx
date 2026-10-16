import { ArrowUpRight, MessageSquareQuote, Quote } from "lucide-react";
import { clientStories, publishedClientStories } from "@/content/client-stories";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { Reveal } from "@/components/reveal";

function publicProjectUrl(value?: string) {
  try {
    const url = new URL(value || "");
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function ClientStories() {
  const stories = publishedClientStories(clientStories);
  return (
    <section
      id="client-stories"
      className="section section-anchor client-stories-section"
      aria-labelledby="client-stories-title"
    >
      <div className="container">
        <Reveal className="stories-heading">
          <div>
            <p className="eyebrow">
              <MessageSquareQuote size={16} aria-hidden="true" />
              Client stories
            </p>
            <h2 id="client-stories-title">
              The other side
              <br />
              of the work<span className="accent">.</span>
            </h2>
          </div>
          <p>
            The collaboration matters as much as the finished product. A place for clients to share
            what we built together.
          </p>
        </Reveal>
        {stories.length > 0 ? (
          <div className="client-story-grid">
            {stories.map((story) => {
              const url = publicProjectUrl(story.projectUrl);
              return (
                <Reveal className="client-story-card" key={story.id}>
                  <Quote size={26} className="client-story-quote-icon" aria-hidden="true" />
                  <blockquote>
                    <p>{story.quote}</p>
                    <footer>
                      <strong>{story.clientName}</strong>
                      {(story.clientRole || story.company) && (
                        <span>{[story.clientRole, story.company].filter(Boolean).join(" · ")}</span>
                      )}
                    </footer>
                  </blockquote>
                  <div className="client-story-project">
                    <p className="eyebrow">The project</p>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {story.projectName}
                        <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <h3>{story.projectName}</h3>
                    )}
                    <p>
                      <strong>My contribution:</strong> {story.contribution}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal className="client-stories-invitation">
            <span className="stories-invitation-icon">
              <MessageSquareQuote size={29} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <div>
              <h3>Have we worked together?</h3>
              <p>
                Share the project, the collaboration, and what made a difference. Client stories
                will appear here after review and permission to publish.
              </p>
            </div>
            <FeedbackDialog />
          </Reveal>
        )}
        {stories.length > 0 && (
          <div className="client-stories-share">
            <p>Have a story from a project we worked on?</p>
            <FeedbackDialog />
          </div>
        )}
      </div>
    </section>
  );
}
