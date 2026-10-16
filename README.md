# Prince Malonzo — Portfolio

A responsive personal portfolio for **Prince Barachiel Malonzo, Full Stack Developer**, built with Next.js App Router, React, TypeScript, Tailwind CSS, selected shadcn/ui components backed by Radix, Motion, and Lucide.

## Local setup

Use Node.js 22.13 or newer (Node 24 recommended; recorded in `.nvmrc`) and npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open the Local URL printed by Next.js, normally `http://localhost:3000`.

```powershell
npm run lint
npm run typecheck
npm test
npm run test:browser
npm run build
npm start
```

The browser suite uses an installed Google Chrome in an isolated test profile. It checks navigation, mobile layouts from 320px to 1440px, theme persistence, concept dialogs, skills, the experience timeline, GitHub calendar keyboard navigation, resume downloads, metadata, contact errors, and WCAG A/AA rules using axe. It does not send real emails. Install Chrome if it is missing, or adjust `channel` in `playwright.config.ts` to your installed browser.

## Content and assets

- Edit **`src/content/portfolio.ts`** for profile details, skills, experience, certificates, social links, and projects.
- Professional content is transcribed from the supplied October 2026 CV. Exact employment titles and dates are retained; the public title is **Full Stack Developer**.
- The original resume is in `public/resume/prince-barachiel-malonzo-resume.pdf`.
- The original 240×240 portrait was extracted from that resume without generating or retouching the person. Replace `public/images/prince-malonzo.png` with a higher-resolution original when available, retaining a square crop or adjusting `Hero`'s image dimensions.
- The three project cards are **temporary, illustrative concepts requested by Prince**. Their interfaces, figures, suggested stacks, and descriptions are sample content. They are labelled on the cards and in their dialogs; they are not claims of completed work or client results.
- To publish an actual project, replace its concept data, set `status: "published"`, and add its screenshot under `public/images/` with the `image`, `contribution`, `repository`, and `liveUrl` fields as appropriate. Only supplied links become buttons. No fake external links are shipped.
- Freelance availability is shown in the hero and contact sections. Edit `profile.availability` to update the badge.
- The National University shield is served locally from `public/images/national-university-logo.webp`. It is the unmodified 2× logo asset from [the university's official website](https://www.nu.edu.ph/), downloaded from its [official CDN](https://dboqplvzu03z6.cloudfront.net/web/production/assets/nu-avatar@2x-5015cf6469c728b152c96e2ee9efb68b453a002934450ab3f54755d9a29d0ea9.webp).

## Project Blueprint

Open **Project builder** from the desktop, mobile, or footer navigation. Visitors can start with a custom website, management system, point of sale (POS), e-commerce store, booking system, or an entirely custom project. Each category suggests relevant features that visitors can add or remove, including inventory, sales and receipts, records, reports, online payments, maps, and integrations. Web, mobile, and combined delivery remain separate choices.

The section URL is `/#project-builder`. The shareable `/project-builder` path redirects there, and older `/#blueprint` bookmarks still open the builder.

Visitors can name a custom project and describe its design, workflows, and other requirements. The interactive diagram updates the proposed application layers and toolkit. **Let's discuss this** fills the contact form with the category, platform, selected features, and customization notes; **Copy project brief** copies the same draft.

This feature is deterministic and runs locally in the browser. It does not call an AI service, collect visitor choices, or invent prices, timelines, completed projects, or credentials. Toolkit suggestions are a conversation starter, not a fixed scope or quote. Edit `src/lib/blueprint.ts` to update its options.

## Request Lab

Open **Try Request Lab** from the hero or **Request lab** from the footer. The shareable section URL is `/#request-lab`. Visitors can trace a sample project request through the browser, API validation, data layer, and response, then try a missing field or an offline data service.

Each run reveals the journey one layer at a time and shows the corresponding HTTP response and JSON. Invalid input skips storage; an unavailable data service returns an error instead of a false success. Changing scenarios or resetting cancels the current run. Reduced-motion users see the finished trace immediately. Controls and outcomes support keyboard and screen-reader use.

The lab is explicitly labelled as a browser simulation. It makes no network requests, writes no records, and needs no credentials. Its sample endpoint and responses are illustrative, not production API routes or performance measurements. Edit `src/components/request-lab.tsx` to change the scenarios.

## Meeting timezone planner

Open **Plan a call** in the footer or the link beside the contact details. The section URL is `/#meeting-planner`. Meeting requests are welcome **24/7**, as specified by Prince. Visitors can detect or select their timezone, choose their local date, preferred hours, and a 30- or 60-minute duration, then compare each proposed time with Manila, including the date.

The planner uses `Intl.DateTimeFormat` and actual UTC instants so daylight-saving gaps, repeated hours, fractional UTC offsets, and cross-date conversions remain accurate. Past starts are excluded. **Request this time** adds the proposal to the existing contact draft without sending it; changing the selection replaces the previous unedited proposal. Copy and tentative `.ics` calendar downloads are also available. Calendar reminders do not send invitations or confirm a booking. Meetings are confirmed by email. No calendar account, API key, or visitor tracking is required.

Edit `src/components/meeting-planner.tsx` for the UI and timezone choices, and `src/lib/meetings.ts` for conversion, slot, and calendar logic.

## Client stories and feedback

The section URL is `/#client-stories`. **Share feedback** opens a form for the project, role/company, quote, and optional publication permission. Permission is unchecked by default. **Prepare feedback** adds a draft to the contact form; the client supplies their name and email and chooses when to send it through the existing EmailJS integration. Nothing is auto-published, and existing contact text is preserved. Oversized additions are rejected without truncating the draft.

Approved stories live in **`src/content/client-stories.ts`**. There are no fabricated starter quotes. Until real entries are supplied, the section shows an invitation to share feedback. To publish a reviewed story, add an entry with `id`, `quote`, `clientName`, `projectName`, and a factual `contribution`, then set both `approvedForPublication` and `published` to `true`. Optional fields are `clientRole`, `company`, and a public HTTP(S) `projectUrl`. Only complete, approved, published entries appear. Each card connects the client's quote to the project and Prince's contribution.

## GitHub contribution calendar

The calendar reads **`malonzo-prince`**'s actual publicly visible GitHub contribution activity. It is fetched on the server and cached for one hour. It is not randomly generated and does not require the visitor to sign in.

By default, the site parses GitHub's public contribution-calendar fragment. It only extracts dates, counts, and intensity levels; upstream HTML is never injected into the page. Because public markup can change, parsing is validated and fails to a link to the real GitHub profile rather than displaying fabricated activity.

For the official GitHub GraphQL API, optionally configure a server-only `GITHUB_TOKEN` with access to the account's public contribution data. Only the contributions query is sent. The token is never included in browser code or logs. If it fails, the site falls back to the public fragment. The site does not change repositories or GitHub settings. Private activity only appears to the extent that GitHub makes it visible on the public profile.

The calendar scrolls within its own region on small screens. A single day participates in the tab order; arrow keys, Home, and End navigate the dates. Hover, focus, or tap a square to see its actual count.

## Contact delivery

**Recipient:** `malonzo.princebarachiel31@gmail.com`.

The contact form sends through **EmailJS** using the server-side `POST /api/contact` endpoint. Visitors stay on the portfolio, and a separate Gmail compose link is available as a fallback. EmailJS credentials never enter the browser bundle.

Use the [EmailJS contact template and setup guide](email-templates/README.md) to configure the recipient, subject, and Reply-To address. The template receives only `name`, `email`, and `message`; project-builder briefs are included in `message`.

To activate delivery:

1. Connect an email service in EmailJS and save the supplied HTML as an email template. Keep **To Email** fixed at `malonzo.princebarachiel31@gmail.com` and **Reply-To** set to `{{email}}` in the dashboard.
2. In **EmailJS Account > Security**, enable API requests from non-browser applications. The portfolio sends from a Next.js server function. See the [official Node.js setup](https://github.com/emailjs-com/emailjs-nodejs).
3. Set `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, and `EMAILJS_PUBLIC_KEY` in the root `.env` or `.env.local`. Set `EMAILJS_PRIVATE_KEY` when private-key authorization is enabled. Keep these server-only names without a `NEXT_PUBLIC_` prefix.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL and leave `CONTACT_FORM_ENABLED=true`, or omit the flag. Missing required EmailJS configuration disables delivery with an honest unavailable response.
5. In **Vercel > Project Settings > Environment Variables**, configure the same EmailJS values for Production and any Preview deployments that should send email. Local `.env` changes are not uploaded through Git. Redeploy after changing Vercel environment variables; existing deployments keep their previous configuration. See [Vercel's environment-variable guide](https://vercel.com/docs/environment-variables).
6. Test a submission on the deployed hostname, check the recipient inbox and spam folder, and verify that Reply addresses the visitor. Never commit `.env` files or private keys.

`POST /api/contact` enforces same-origin submissions, bounded JSON bodies, Zod validation, a honeypot, and a best-effort per-instance limit of five valid attempts per client per ten minutes. This in-memory limit is not a distributed quota. The server selects the EmailJS service and template; visitors cannot set the recipient or inject template configuration. The provider request has a 12-second timeout. Network errors and rejected submissions are reported without exposing credentials, preserving the visitor's message on failure.

The portfolio does not store messages in a database. EmailJS and the connected email service process the submission. The form links to EmailJS. See the [EmailJS send API](https://www.emailjs.com/docs/rest-api/send/). Set `CONTACT_FORM_ENABLED=false` to pause the endpoint.

## Vercel deployment

1. Push this project to a repository you own.
2. Import the repository into Vercel and select the **Next.js** framework preset.
3. Use `npm run build`; keep the output-directory setting at its framework default. Use a supported Node version that meets the package's engine requirement.
4. Add the environment variables above. The existing URL in `.env.example` comes from the CV; update it if deploying to a different URL.
5. Deploy, then check theme switching, resume download, GitHub activity, project links, contact delivery, and social previews on the production hostname.

No paid plan or domain purchase is performed by the source code. A custom domain is optional. EmailJS account credentials are required for contact delivery.

## Structure

```text
src/app/                 Page, metadata, styles, and contact endpoint
src/components/          Portfolio sections and interactive features
src/components/ui/       Small shadcn-style Radix primitives
src/content/portfolio.ts Typed, editable portfolio content
src/lib/                 Contact validation, GitHub data, and configuration
public/                  Original CV and portrait
tests/                   Contact and calendar unit tests
tests/browser/           Responsive and accessibility browser checks
```

Fonts are served from the site through `next/font`; visitors do not make requests to Google Fonts. Initial builds need access to Google Fonts to fetch the font files. The GitHub section has its own unavailable state, so an upstream failure does not block the rest of the portfolio.
