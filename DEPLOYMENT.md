# AWS Amplify deployment

Status: live at [AWS Amplify](https://main.d229cwpntq8yz1.amplifyapp.com). Source: [srivilliamsai/portfolio](https://github.com/srivilliamsai/portfolio). The connected `main` branch builds on Amplify. The instructions below also document how to reproduce the hosting setup.

The GitHub Production job verifies the exact public commit and hashes before reporting success. It does not initiate a second deployment or store AWS keys. See [SECURITY.md](SECURITY.md) and [CI.md](docs/CI.md).

Use the [6 November release review](docs/AMPLIFY_RELEASE.md) for current public-site findings, frontend deployment steps and the separate Gemini backend requirement. Public values are in [the Amplify environment template](deployment/amplify.env.example).

The owner created the `will-assistant` CloudFormation stack in Mumbai on 6 November 2026. Public API checks confirmed streamed Gemini chat, WAV speech and ephemeral Live token creation through Amplify. [Connect WILL to Gemini](deployment/CONNECT_WILL.md) documents the prepared [CloudFormation template](deployment/will-assistant-stack.json), private key storage, updates and recovery. Run `npm run assistant:package` after backend/knowledge changes and update that stack separately from frontend Git pushes.

## Build contract

| Setting | Repository configuration |
|---|---|
| Runtime | Node.js 22, declared in `.nvmrc` and `amplify.yml` |
| Install | `npm ci --cache .npm --prefer-offline` |
| Pre-build checks | `npm test` and `npm run check:assets` |
| Build and output checks | `npm run build` and `npm run check:dist` |
| Publish directory | `dist` |
| Public environment variable | `VITE_SITE_URL`, set to the assigned public HTTPS origin |
| Deep-link fallback | 200 SPA rewrite supplied in `deployment/amplify-rewrites.json` |
| Header configuration | `customHttp.yml` |

The repository's Vite build produces the website. An empty build command intended for a plain HTML tutorial would not build this application. [AWS build specification reference](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html).

## Owner deployment sequence

1. Use [srivilliamsai/portfolio](https://github.com/srivilliamsai/portfolio), branch `main`, with application and hosting configuration at the repository root. Confirm the GitHub CI checks pass before connecting Amplify.
2. In Amplify Hosting, connect only that repository and branch. Use the supplied build specification and Node 22.
3. Obtain the branch's assigned HTTPS origin. Set it as `VITE_SITE_URL` without a path, query or credentials. If the URL becomes visible only after creating the app, set it and retry the build. The Amplify build guard rejects a missing, private or non-HTTPS production origin.
4. Confirm `dist` is the artifact directory. The build should complete its tests, asset validation and output checks before publishing artifacts.
5. Keep `/api/assistant/<*>` as the first rule in Hosting → Rewrites and redirects. The backend stack manages this rule. If the SPA fallback needs updating, use the rule in `deployment/amplify-rewrites.json` without replacing the API rule. Committing that JSON alone does not configure the console. The fallback preserves file delivery, including the contact sound (`mp3`). [AWS SPA rewrite reference](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html).
6. Confirm the header settings are applied to the actual hosted responses. Configuration text alone is not runtime evidence.
7. Deploy when ready. Record the actual live URL, public source URL, successful job and verification date in the README and testing record.

## Public verification after deployment

- Open the HTTPS homepage without authentication, then use Projects, Skills, About me and Contact.
- Open and refresh each project route, the blog index and at least one individual article directly. The full route catalog is in `src/app/routeCatalog.js`.
- Load a real WebP/JPEG image, font and the local message sound. Confirm file responses have the correct content types; asset requests must not receive the SPA HTML.
- Check canonical/social metadata, `/robots.txt` and `/sitemap.xml` use the actual AWS origin. Inspect route metadata after navigation as well as entry-page HTML.
- Open WILL from the header, check typed chat and its transcript controls, then close it and resume normal navigation.
- Verify required links, response headers and current mobile/keyboard behavior. Use the scenarios in [TESTING.md](docs/TESTING.md).

## Evidence to capture

Capture the successful Amplify job, repository/branch and build/output settings, applied rewrite/header configuration, and the actual public site. Hide credentials and unnecessary account identifiers. Keep local product screenshots labelled as local; they do not demonstrate AWS deployment.

The portfolio frontend uses Amplify Hosting. The optional WILL backend template provisions Lambda, Secrets Manager, IAM roles and CloudWatch logs only after its stack is created. Do not claim those resources are deployed before confirming the stack, or list a service as used merely because a separate featured project mentions it.

## Recovery and availability

For build failures, confirm Node 22, the lockfile, `VITE_SITE_URL` and artifact directory, then inspect the failed step. For direct-link failures, check the hosting rewrite. For missing assets, verify the file exists in `dist` and its extension bypasses the fallback. If an unversioned static image looks stale, inspect its cache headers and the deployed artifact.

Retain the last working deployment while fixing a failed replacement. Keep the final site available throughout the official judging window and verify the current deadline/window against the official rules before submitting. No uptime or deployment success is claimed by these instructions.

## Contact and booking settings

The default booking URL is the owner's verified [30-minute Cal.com event](https://cal.com/srivilliamsai/30min). `VITE_BOOKING_URL` can override it with another public Cal.com or Calendly event URL. The contact form defaults to the owner's public Formspree endpoint, `https://formspree.io/f/xnpplzoz`, in `src/data/portfolio.js`, so both local development and the next Amplify build use it without extra settings. Verify the recipient in the Formspree dashboard. `VITE_CONTACT_FORM_URL` can optionally override this endpoint. These are public URLs, not API keys; no SDK or mail credential is required. For local overrides use an ignored `.env.local`; on Amplify use the app's build environment variables and rebuild.

The contact form posts JSON to the configured Formspree endpoint, using [Formspree's AJAX submission support](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/). The security policy permits that exact service origin. Enable the form provider's available spam protection and restrict accepted domains to the owner's deployed site and local testing origin as appropriate.

Only a successful JSON acknowledgement marks a note submitted. A missing endpoint, timeout, or unconfirmed response keeps the visitor’s note in the form with an inline error and a retry option. The form never opens the visitor’s mail app. The separate email-address link remains available for visitors who choose email. The header and contact card open the owner's 30-minute calendar in a new tab. Do not reuse the reference designer's calendar or mail service. After configuring, verify a real submission arrives in the owner's inbox and inspect the correct calendar without booking a test meeting. Local mocked tests do not prove inbox delivery.

## Release checks for the 6 November revision

Both CI and Amplify run the source/asset audits before publishing. The local `.local-archive/` directory, test reports, source, docs and server configuration are not copied into `dist`. Use `npm run verify:ci` with the intended public HTTPS `VITE_SITE_URL`, then verify the compiled preview. The local WILL acceptance report contains 2,472 distinct questions; it does not test a configured paid model or establish physical-device voice quality.

After the actual deployment, verify Back/Forward from About me, repeated WILL open/close without a page jump, direct project/blog URLs, mobile layout, certificate previews, provider configuration if enabled and real contact delivery. Keep the prior working Amplify deployment available until the new commit and hashes pass the existing Production verifier.
