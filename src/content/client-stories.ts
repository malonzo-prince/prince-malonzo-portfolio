export type ClientStory = {
  id: string;
  quote: string;
  clientName: string;
  clientRole?: string;
  company?: string;
  projectName: string;
  projectUrl?: string;
  contribution: string;
  approvedForPublication: boolean;
  published: boolean;
};

// Add real, approved feedback here. Incoming contact messages are never auto-published.
export const clientStories: ClientStory[] = [];

export function publishedClientStories(stories: readonly ClientStory[]) {
  return stories.filter(
    (story) =>
      story.published &&
      story.approvedForPublication &&
      [story.quote, story.clientName, story.projectName, story.contribution].every(
        (value) => value.trim().length > 0,
      ),
  );
}
