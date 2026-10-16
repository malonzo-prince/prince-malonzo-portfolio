export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || "https://pmalonzo-portfolio.vercel.app";
  const url = new URL(configured);
  if (url.protocol !== "http:" && url.protocol !== "https:")
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.");
  return url.origin;
}
