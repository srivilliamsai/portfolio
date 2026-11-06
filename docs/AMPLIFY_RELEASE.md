# Release record — 6 November 2026

This record describes the reviewed implementation, the completed backend connection and the checks required for the frontend release. Local checks and successful API calls do not establish physical microphone behavior or contact inbox delivery.

## Completed implementation

- WILL replaces the retired Developer Terminal with a responsive robot tour, typed/voice controls and transcript.
- Portfolio questions use approved facts, requested names/count formats, project aliases and contextual follow-ups. Full-name, unknown residence/family and media requests retain their correct scope.
- Selected screenshots remain visible; project lists do not choose an incidental PitStop image. Both portraits, three Spotify players, right-side song artwork and explicit dismissal are supported.
- Voice includes cleanup, continuous local interruption monitoring, word-boundary captions and excited star pupils. The phone introduction is centered with the requested heading line break; wide media is capped at 560px without an empty frame below it.
- The uploadable backend uses a response-streaming Lambda adapter, private Secrets Manager storage and a scoped custom resource that preserves existing Amplify routes. Dotted AQ-format keys are accepted.

## Verified backend

The owner created the `will-assistant` stack in Mumbai and supplied a screenshot of **CREATE_COMPLETE**. Public checks through `https://main.d229cwpntq8yz1.amplifyapp.com` confirmed HTTP 200 JSON status, a Gemini chat stream with three deltas and a final result, a valid 126,764-byte WAV response, and ephemeral Live token creation using `gemini-3.8-live` and `Algieba`. Token/key values and audio are not retained in this record.

The backend is separate from the static frontend. A Git push does not update Lambda code or its embedded knowledge. See [the connection guide](../deployment/CONNECT_WILL.md) for stack updates and key rotation. These public checks did not access the AWS account or complete a physical microphone/Live browser session.

## Local verification and repository cleanup

`npm run verify:ci` on Node 22 passes 265 tests, including 2,472 distinct local WILL questions and 11 deployment tests, plus source/asset, documentation, public-origin, build and distribution checks. A dependency audit reports zero known vulnerabilities. Packaged provider calls use mocked responses in CI; the public API checks above are recorded separately.

Real environment files, account credentials, private-key exports, test reports, review logs, the earlier raw readiness JSON and retired cover backups are ignored by Git. Active source, tests, licenses, guides and the key-free CloudFormation template remain versioned. Distribution checks recognize legacy and AQ-format credential patterns.

Before this frontend release, the public artifact still identified commit `c0cfdd5e6eaaea42eb57bed577f62d824d076b08` and served headers blocking microphone and Spotify. The release includes the updated `customHttp.yml`; the final deployed commit and hashes are reported by GitHub's Production job. Do not infer a completed frontend release merely from a successful push or backend status.

## Deploy the frontend

1. Confirm Amplify connects GitHub repository `srivilliamsai/portfolio`, branch `main`, with automatic builds enabled. The root [amplify.yml](../amplify.yml) installs Node 22, runs checks and publishes `dist`.
2. In **Hosting → Environment variables → Manage variables**, copy [amplify.env.example](../deployment/amplify.env.example). `VITE_SITE_URL` must be the actual public HTTPS origin. Rebuild after changes: Vite embeds public values at build time.
3. Under **Hosting → Rewrites and redirects**, apply the SPA fallback from [amplify-rewrites.json](../deployment/amplify-rewrites.json), preserving any existing API rule at the top. Committing that JSON alone does not configure the console. The optional backend stack adds its API proxy automatically; do not overwrite that rule when updating the SPA fallback.
4. Include `customHttp.yml` in the commit. After deployment, inspect actual responses for `microphone=(self)`, `frame-src https://open.spotify.com`, and the approved contact/WebSocket connections.
5. Review and commit the intended changes, including new source, tests and artwork. Keep `.env.local`, `.env.assistant.local` and credentials out of Git. Push the commit to the connected `main` branch. With automatic builds enabled, that triggers deployment.
6. Wait for Amplify and GitHub Production verification. Compare `/deployment.json` with the new commit. Refresh project/blog routes directly; check covers, all Spotify players, microphone permission, WILL open/close and real contact delivery.

Static hosting supports the portfolio, local answers, browser speech and Spotify embeds. Browser voices depend on the visitor’s device. The assistant falls back to local answers when its API is unavailable.

## Gemini chat, server TTS and Live voice

These need an additional backend. The Vite development server mounts `server/assistant.mjs` locally; the Amplify build publishes static `dist` files and does not run this server.

1. Follow [the console connection guide](../deployment/CONNECT_WILL.md). Upload [will-assistant-stack.json](../deployment/will-assistant-stack.json) to CloudFormation in the Amplify app's account and Mumbai region. Enter the existing key privately in the masked `GeminiApiKey` parameter. The stack creates a response-streaming Lambda adapter, Secrets Manager storage, execution roles and seven-day log groups, and adds the Amplify API proxy while preserving other rules. Resources and provider requests can incur charges.
2. Leave `VITE_ASSISTANT_API_URL` empty. The stack keeps requests on the frontend origin. Its `FrontendOrigin` parameter configures backend CORS; use the actual frontend domain. Model IDs and voice are stack parameters. The public smoke check confirmed these default models with the deployed account; later key/model changes need their own real request checks.
3. Wait for `CREATE_COMPLETE`, then verify JSON from the stack's `StatusUrl` output. A `gemini` status confirms configuration, not that Google accepted a model request. Verify streamed `/chat`, WAV `/tts`, and an ephemeral `/live-session` token through the actual deployed proxy. Test speech, interruption and recovery on real devices; review provider quota and request limits before public use.
4. Deploy the latest frontend and headers separately. After changing backend code or embedded portfolio knowledge, run `npm run assistant:package` and update the CloudFormation stack with the regenerated template. A frontend Git push does not update this Lambda.
5. For another Node host, [the server-only environment template](../.env.assistant.example) and handler remain available. An external `VITE_ASSISTANT_API_URL` also needs that exact HTTPS origin in `customHttp.yml` `connect-src`, plus backend CORS. An environment variable alone does not update the security policy.

Never use `VITE_GEMINI_API_KEY`: all `VITE_*` values become browser-visible. Keep permanent keys in the backend’s environment/secret store. Adding server variables to a static Amplify build does not create a backend.

## Sources

- [AWS environment variables](https://docs.aws.amazon.com/amplify/latest/userguide/setting-env-vars.html)
- [AWS build settings and automatic builds](https://docs.aws.amazon.com/amplify/latest/userguide/edit-build-settings.html)
- [AWS SPA and reverse-proxy rewrites](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html)
- [Vite public build-time variables](https://vite.dev/guide/env-and-mode)

## Live image and caption follow-up

The owner reported that named project questions in Live voice did not consistently open their images and speech text could be absent. The frontend now explicitly requests input/output audio transcription, routes the recognized question through approved media selection at answer start without requiring a model tool call, and displays in-progress user text in the transcript. Text-only model parts also remain visible. A live typed check also exposed a provider media-display marker; that marker is removed from visible and spoken answer text. The follow-up suite passes 271 tests. Four session regressions exercise all six projects, late transcription ordering, manual selection, project lists, interruption and caption output. These use simulated audio/provider events, not a physical-device microphone recording.

The preceding release e4a1957 passed all three platform checks and GitHub Production verification. Public response headers now allow the microphone and Spotify; the prior blocked-header observation above is historical. See [submission draft](SUBMISSION.md) for the Builder Center write-up and screenshot plan.

The name follow-up keeps SRI VILLIAM SAI in writing while treating Sri as one spoken word. Browser speech normalizes standalone SRI, and every new Live session receives the explicit pronunciation guide without requesting an answer. Repeated synthetic name checks preserve written capitals and caption offsets; they do not prove acoustic pronunciation on every voice.
