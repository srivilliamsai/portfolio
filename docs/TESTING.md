# Test results and live website review

## Release verification — 6 November 2026

The release suite passes **265 tests**, including **2,472 distinct WILL questions** and 11 backend deployment tests, on Node.js 22.23.4. Asset, reachable-source, documentation, production-origin, build and distribution checks pass. The dependency audit reported zero known vulnerabilities. Raw JUnit/TAP, per-question answers, unused-file results and review logs remain in ignored `test-results/`; the earlier generated `docs/production-readiness.json` is a local historical report and is excluded from Git.

The local corpus generates natural-language variations across approved case-study sections, technologies, selected certificates, images and biography. It checks topic, grounded detail and allowlisted media. These are deterministic local questions, not 2,472 human conversations or paid-provider evaluations. Reported transcripts add regressions for project aliases, full name, unknown current location/family, names/count formats, photo retention, both portraits, music and non-repeating follow-ups.

Deployment tests regenerate the key-free CloudFormation upload, run its compressed Lambda entrypoint, and check chat streaming before completion, WAV bytes, secret caching/rotation, bounded requests, disconnects and safe Amplify route changes. The bundled Google SDK uses mocked wire responses during tests. Synthetic examples cover both legacy keys and the dotted AQ format; tests never contain real keys.

## Public backend check — 6 November 2026

The owner's CloudFormation screenshot showed `will-assistant` in **CREATE_COMPLETE** in Mumbai. Public requests through the Amplify origin then returned:

| Route | Observed result |
|---|---|
| `/api/assistant/status` | HTTP 200 JSON; Gemini chat, voice and TTS enabled |
| `/api/assistant/chat` | HTTP 200 event stream; three deltas and a final Gemini result, with no stream error |
| `/api/assistant/tts` | HTTP 200 `audio/wav`; valid RIFF/WAVE header, 126,764 bytes |
| `/api/assistant/live-session` | HTTP 200; ephemeral token present, `gemini-3.8-live`, `Algieba` |

No permanent key, token value, audio recording or visitor conversation is retained in this record. The pre-release frontend still served the older commit and headers blocking microphone/Spotify. The frontend release must be observed through the exact-commit Production job and actual response headers; backend success alone does not publish local frontend edits. See [the release record](AMPLIFY_RELEASE.md).

## Browser evidence and limits

An earlier same-day compiled baseline checked 26 canonical pages at desktop and mobile widths, with no horizontal overflow, broken loaded images or missing fragment targets. Focused follow-up checks covered scroll restoration, WILL open/close, reported answer routing, the phone introduction, Spotify selection and 560px landscape-preview bounds. These local observations are separate from the historical public results below.

Native caption regressions cover long pauses, pause/resume and cancellation. They verify timing events, not subjective audio quality. Real microphone recognition, acoustic barge-in, browser Live playback, screen-reader behavior, and contact inbox receipt still require their own device/account acceptance checks. No contact message or calendar booking was sent by this release review.

Reviewed unused files and retired cover backups remain local and ignored. Active source, tests, documentation, credits and deployment templates are retained in Git. CI and Amplify run the required checks before publishing; GitHub Production verifies the deployed commit and file hashes after the main-branch push.

## Historical public review

Verified on **3 November 2026** against [the live portfolio](https://main.d229cwpntq8yz1.amplifyapp.com), commit `2af73d7`. This document separates completed checks from checks outside this review. The earlier generic “public review pending” labels have been replaced with the actual results.

## Automated verification

[The successful GitHub CI and Production run](https://github.com/srivilliamsai/portfolio/actions/runs/41622769126) passed on Linux, macOS and Windows with Node.js 22. Each platform passed **1,832 tests**, with no failures. These are code-level cases, not 1,832 browser journeys.

| Check | Verified result |
|---|---|
| Terminal and portfolio suite | 1,832 passing cases, including 1,630 unique informational inputs and 125 conversation sequences |
| Input and content security | Restricted article markup and URL schemes; terminal input/history limits; unsupported and ambiguous input |
| Deployment verifier | Rejects stale/wrong-origin metadata, missing or altered files, network failures, oversized responses and timeouts |
| Required public assets | 53 active references resolve; all 53 required files checked |
| Production build and artifacts | Passed; checks metadata, discovery files, credential patterns and the public release hashes |
| Rewrite configuration | All 18 canonical routes and required public asset exclusions covered |
| Documentation | Local Markdown links and code fences checked; documentation is excluded from the published site artifact |
| GitHub CodeQL | [Final source and workflow scan passed](https://github.com/srivilliamsai/portfolio/actions/runs/41622769378) |
| Dependency audit | [Audit passed](https://github.com/srivilliamsai/portfolio/actions/runs/41618551465); the recorded lockfile audit reported zero known vulnerabilities on 3 November 2026 |
| Production | Exact deployed commit and 18 entry/theme/bundle file hashes verified before reporting success |

To reproduce the automated checks:

```sh
npm ci
npm run verify:ci
npm audit --audit-level=high
```

CI uses an example public origin only for its inspection artifact. Amplify builds with the actual configured public origin. The Production job checks the real AWS site; it does not start another AWS build or require AWS keys. See [CI.md](CI.md) and [SECURITY.md](../SECURITY.md).

## Completed live browser acceptance

The following interactions were executed on the public AWS website at desktop and 390 × 720 mobile viewport sizes. [live-acceptance.json](live-acceptance.json) records the actual commands, outputs, navigation observations and link responses for the tested commit.

| ID | Scenario | Result |
|---|---|---|
| WEB-01 | Reach Projects, Skills and About without using Terminal | **Passed** — each navigation link reached its section with Terminal closed |
| WEB-02 | Open PitStop, Carbon Footprint and Glassora from their cards | **Passed** — all three opened their own case studies at both viewport sizes; no horizontal page overflow observed |
| NAV-01 | Select mobile menu links, reopen the menu and open Terminal | **Passed** — section selection closed the menu; reopening and the internal Terminal control worked |
| TERM-01 | Run `story` | **Passed** — response explains the separate Java/React and native SwiftUI applications |
| TERM-02 | Run `porjects`, unknown input and ambiguous `hell` | **Passed** — typo corrected to projects; unknown input received a fallback; ambiguity suggested hello or help |
| TERM-03 | Run `glassora`, then `its free` | **Passed** — returned the dated India App Store download-price record |
| TERM-04 | Switch to `wyndra`, then ask `its free` | **Passed** — states that pricing is not recorded |
| TERM-05 | Change topic, use Clear, or reload before a follow-up | **Passed** — all three reset project context and requested a project name |
| KEY-01 | Tab/Shift+Tab, completion, history and Escape | **Passed** — completion worked, the draft restored, focus wrapped inside the modal, and Escape returned focus to the opener |
| AWS-01 | Request public page routes and open project/article deep links | **Passed** — all 18 canonical HTTP route responses checked; project and article rendering also checked in the browser |
| AWS-02 | Retrieve representative image, font, PDF, theme and release metadata | **Passed** — expected response types verified |
| AWS-03 | Check public origin metadata and security headers | **Passed** — production artifact checks and public CSP, HSTS and permissions-header checks recorded |

The AWS response/header results are retained in [security-validation.json](security-validation.json); the newer browser acceptance report names the later commit it exercised. The latest deployment result is available in [GitHub Actions](https://github.com/srivilliamsai/portfolio/actions/workflows/ci.yml).

## Limited and unperformed checks

These entries are separate from the completed website tests, so they cannot be mistaken for failed CI or an unfinished deployment.

| ID | Check | Actual scope or remaining limitation |
|---|---|---|
| EXT-01 | External destinations and contact links | 15 HTTP links returned 200, including project sources/demos, App Store, contribution pages and the résumé PDF. LinkedIn returned HTTP 999 to the automated request, so its profile content remains unverified. Email/telephone URI formats are valid; no message or call was initiated |
| A11Y-01 | Physical devices, assistive technology and reduced motion | Keyboard focus and visible control labels were checked. A dedicated physical-touch, screen-reader and reduced-motion browser session has **not been performed** |

An HTTP 200 response establishes reachability at the time checked; it does not certify the full behavior or content of an external service. Glassora’s embedded price record is dated 3 November 2026 for India, not a promise of permanent worldwide pricing. Opening contribution URLs does not revalidate their merge metadata.

## Earlier evidence and review limits

[verification.json](verification.json) retains earlier dated local checks as history. Its original isolated-copy and documentation-layout records do not replace the current public checks above. The owner-provided [desktop image](screenshots/portfolio-desktop.png), [local mobile menu](screenshots/local-mobile-menu.png), [local terminal story](screenshots/local-terminal-story.png) and [local follow-up](screenshots/local-terminal-followup.png) remain labelled according to their source. The earlier [desktop document preview](screenshots/document-layout-desktop.png) and [mobile document preview](screenshots/document-layout-mobile.png) describe that earlier documentation revision.

This is a focused static-site review, not a comprehensive penetration test, historical secret audit, AWS account/IAM audit, native-app test run or uptime measurement. Challenge eligibility and publication are separate from these technical checks.

## Additional reported Live regressions — 6 November 2026

The Live grounding tests cover Lasora/Glasura spellings, 500-word case-study answers, all six architecture flows, five repeated compatibility rounds, unknown adoption counts, and ambiguity between earphones, iPhone and F1 analysis. Session tests cover interim-only speech, mixed interim/final packets without duplicates, full-name display, initial public reference context, and tool/media follow-ups advancing one section per turn. Sound tests exercise ten suspended/interrupted revisits and prevent delayed or muted effects from replaying. These mocks validate application behavior; they do not establish physical microphone or speaker output.
