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

## GitHub contribution calendar

The calendar reads **`malonzo-prince`**'s actual publicly visible GitHub contribution activity. It is fetched on the server and cached for one hour. It is not randomly generated and does not require the visitor to sign in.

By default, the site parses GitHub's public contribution-calendar fragment. It only extracts dates, counts, and intensity levels; upstream HTML is never injected into the page. Because public markup can change, parsing is validated and fails to a link to the real GitHub profile rather than displaying fabricated activity.

For the official GitHub GraphQL API, optionally configure a server-only `GITHUB_TOKEN` with access to the account's public contribution data. Only the contributions query is sent. The token is never included in browser code or logs. If it fails, the site falls back to the public fragment. The site does not change repositories or GitHub settings. Private activity only appears to the extent that GitHub makes it visible on the public profile.

The calendar scrolls within its own region on small screens. A single day participates in the tab order; arrow keys, Home, and End navigate the dates. Hover, focus, or tap a square to see its actual count.

## Contact delivery

**Recipient:** `malonzo.princebarachiel31@gmail.com`.

The contact form sends messages directly through **FormSubmit**, without API keys or a sending domain. It uses `POST /api/contact` and keeps visitors on the portfolio. A separate Gmail compose link is available as a fallback.

To activate delivery:

1. Submit the form once, then click **Activate Form** in the email FormSubmit sends to the recipient. This setup request has been sent, and Prince confirmed activation during development.
2. Keep `CONTACT_TO_EMAIL=malonzo.princebarachiel31@gmail.com`, or change it deliberately. A different recipient needs its own activation.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL. The relay includes this as the form's source URL.
4. Optionally set `FORMSUBMIT_FORM_ID` to the private identifier FormSubmit supplies after activation. No identifier is required for the default email endpoint.
5. Test a submission on the deployed hostname and check the recipient inbox and spam folder.

`POST /api/contact` enforces same-origin submissions, bounded JSON bodies, Zod validation, a honeypot, and a best-effort per-instance limit of five valid attempts per client per ten minutes. This in-memory limit is not a distributed quota; FormSubmit also applies its own abuse filtering. No CAPTCHA-disabling flag is sent. Only a fixed recipient and whitelisted name, reply email, and message fields reach the relay. Activation requirements, network errors, and rejected submissions are reported honestly, preserving the visitor's message on failure.

The portfolio does not store messages in a database. FormSubmit processes submissions and, according to its documentation, retains an archive for 30 days. The form links to the provider. See [FormSubmit's AJAX guide](https://formsubmit.co/ajax-documentation), [activation help](https://formsubmit.co/help), and [documentation](https://formsubmit.co/documentation). Set `CONTACT_FORM_ENABLED=false` to pause the endpoint.

## Vercel deployment

1. Push this project to a repository you own.
2. Import the repository into Vercel and select the **Next.js** framework preset.
3. Use `npm run build`; keep the output-directory setting at its framework default. Use a supported Node version that meets the package's engine requirement.
4. Add the environment variables above. The existing URL in `.env.example` comes from the CV; update it if deploying to a different URL.
5. Deploy, then check theme switching, resume download, GitHub activity, project links, contact delivery, and social previews on the production hostname.

No paid plan, domain purchase, or live publication is performed by the source code. A custom domain and email-service API keys are optional with the selected FormSubmit setup.

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
