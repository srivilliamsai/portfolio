# Test results and live website review

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

This is a focused static-site review, not a comprehensive penetration test, historical secret audit, AWS account/IAM audit, native-app test run or uptime measurement. Challenge eligibility and publication are tracked separately in the [evaluation guide](EVALUATION.md) and [submission draft](SUBMISSION.md).
