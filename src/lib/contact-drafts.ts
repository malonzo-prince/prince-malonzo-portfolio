/** Preserve the visitor's draft and replace only an unchanged previous addition. */
export function addContactDraft(
  current: string,
  addition: string,
  previous?: string,
): string | null {
  const message = addition.trim();
  if (!message) return current;
  const next =
    previous && current.includes(previous)
      ? current.replace(previous, () => message)
      : current.includes(message)
        ? current
        : [current.trim(), message].filter(Boolean).join("\n\n");
  return next.length <= 5000 ? next : null;
}

export function feedbackBrief({
  project,
  role,
  quote,
  publish,
}: {
  project: string;
  role: string;
  quote: string;
  publish: boolean;
}) {
  return [
    "Client feedback",
    `Project: ${project.trim()}`,
    ...(role.trim() ? [`My role / company: ${role.trim()}`] : []),
    "",
    "My experience:",
    quote.trim(),
    "",
    publish
      ? "Permission to publish: Yes. Prince may publish this feedback with my name, role/company, and project details after review."
      : "Permission to publish: Not granted. This feedback is private.",
  ].join("\n");
}
