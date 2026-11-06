# SRI VILLIAM SAI — Developer Portfolio

[![Portfolio CI](https://github.com/srivilliamsai/portfolio/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/srivilliamsai/portfolio/actions/workflows/ci.yml)

A React/Vite portfolio covering web, native iOS and SaaS development. The homepage features PitStop, Invoice Picker and Glassora; `/projects` presents all six case studies. Visitors can explore skills, experience, five Workday contributions, three certificate documents, 117 credential cards and nine articles, or ask WILL about the work.

The static site is hosted on [AWS Amplify](https://main.d229cwpntq8yz1.amplifyapp.com). Local changes and build reports do not update that deployment. [Deployment instructions](DEPLOYMENT.md) explain the release and exact-commit verification.

## Features

- Six case studies with responsive covers, interactive user flows, system walkthroughs and six-part operations diagrams.
- A monochrome visual system in both appearances, following the device theme. The skills grid retains four columns on phones with compact 80px rows.
- Browser history restores the previous reading position immediately. Explicit section links scroll to their target; delayed route work is cancelled when the visitor moves on.
- WILL provides typed chat, a transcript, contextual gallery selection, Gemini speech and Live voice. A separately deployed Lambda backend keeps the permanent key in Secrets Manager; the local responder remains available as a fallback.
- WILL recognises photo names and follow-ups, advances through requested pictures, explains specific case-study sections and keeps “explain more” on the current topic. Specific project names, documented purposes and reported speech variants take priority over general project lists; names-only and count-only requests return that format without extra cards or commentary.
- Contact notes use the configured Formspree endpoint; booking links open the owner's calendar.

## Run locally

Use Node.js 22 from `.nvmrc`:

```sh
npm ci
npm run dev
```

Vite prints the local address. For port 3001:

```sh
npm run dev -- --host 127.0.0.1 --port 3001
```

See [local setup](docs/LOCAL_SETUP.md) for Windows commands and public configuration. No provider key is needed for local answers. Permanent keys belong only in ignored server configuration.

## Validate a release

```sh
npm run verify:ci
npm audit --audit-level=high
npm run preview -- --host 127.0.0.1 --port 4174
```

Verification runs the application tests, **2,472 distinct WILL acceptance questions**, reachable-source and asset audits, documentation checks, production build and distribution validation. The acceptance questions cover case-study sections, technologies, certificates, gallery images and confirmed biography. They are deterministic local-responder checks, not 2,472 human conversations or paid model evaluations.

Generated evidence lives in ignored `test-results/`: JUnit/TAP reports, `will-acceptance.json` and `unused-files.json`. The dated [testing record](docs/TESTING.md) separates current local evidence from historical public results.

## WILL and voice

Opening WILL can request microphone permission for its local welcome meter. Choosing Type instead stops that preview; Start talking begins recognition or a configured voice connection. Browser playback prefers the owner-selected Aman Indian English voice and pins it for the session. Caption word boundaries are authoritative when the voice supplies them; voices without boundaries use conservative estimated timing.

The owner is written as **Villiam**, or **SRI VILLIAM SAI** for the full name, and pronounced William. Naruto fandom and MongoDB.local attendance are owner-confirmed. Event location/date, favourite Naruto character and other unknown personal details are not invented. See [assistant configuration and limitations](docs/VILL.md) and [image credits](docs/licenses/will-gallery-photos.md).

On 6 November 2026, the `will-assistant` CloudFormation stack completed in Mumbai. Public checks confirmed Gemini chat deltas, a valid WAV speech response and an ephemeral Live session token through the Amplify API route. These API checks do not establish physical microphone playback or interruption behavior. See the [release record](docs/AMPLIFY_RELEASE.md) and [backend connection guide](deployment/CONNECT_WILL.md).

## Maintenance and deployment

`npm run check:unused` audits the actual application import graph and public asset references. Reviewed unused files and retired cover backups remain in ignored local archive directories. Generated reports, local environment files, account credentials and private-key exports are ignored; active source, tests, documentation, image credits and key-free deployment templates are versioned.

GitHub CI runs on Linux, macOS and Windows with Node 22. Amplify builds connected pushes and publishes `dist`; it requires the actual public HTTPS `VITE_SITE_URL`. The Production job checks the deployed commit and file hashes after a push to `main`. Keep the assistant API rewrite before the SPA fallback and leave `VITE_ASSISTANT_API_URL` empty for this same-origin setup. Backend/knowledge changes require `npm run assistant:package` and a separate CloudFormation stack update; a frontend push does not update Lambda.

[Architecture](docs/ARCHITECTURE.md) · [Testing](docs/TESTING.md) · [CI](docs/CI.md) · [Deployment](DEPLOYMENT.md) · [Security](SECURITY.md)
