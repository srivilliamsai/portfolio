# Verification record and review scenarios

Checked on 3 November 2026 using Node.js 22.23.4. Automated verification ran in an isolated project copy whose source, assets, configuration, tests and lockfile were confirmed byte-identical to this AWS project. This kept installed dependencies and build output out of the delivery folder.

## Automated execution

```sh
npm ci
npm run verify
```

| Check | Result and scope |
|---|---|
| Unit suite | 1,794 passed; zero failed, skipped or cancelled. Parameterized code-level cases across eight files, not 1,794 independent browser journeys |
| Question corpus | Includes 1,630 unique informational inputs. Fixed expectations cover topics, spelling, normalization and unsupported/ambiguous cases |
| Conversation corpus | Includes 125 multi-turn sequences. Checks project context, switching, resets and follow-ups |
| Report regression cases | Three cases cover forbidden XML control characters, readable escaping and preservation of valid Unicode; the generated JUnit XML parsed successfully for all 1,794 test cases |
| Hosting regression cases | Seven additional cases cover canonical/legacy routes, all public asset exclusions and public-origin validation without AWS/network access |
| Public assets | 51 active references; 51 required files verified. Confirms local presence and reference coverage, not external-link availability |
| Production build | Passed with Vite 6.4.5. Compiles the actual React/Vite application |
| Build artifacts | Passed with a public example Amplify origin under the build guard. Checks metadata, selected sitemap paths, retired integrations and credential patterns; the example host was not deployed or contacted |
| Document layout | Four rendered PNG diagrams with editable SVG sources; local links, text bounds and the 1,000-point maximum are checked. Rendering does not depend on a Mermaid-enabled Markdown viewer; the worksheet has no awarded score |
| Build boundary | Build and artifact check passed with the new documentation present. Documentation and its local screenshots were not published into `dist` |
| Rewrite evaluation | All 18 canonical routes matched; all 51 public assets bypassed the fallback. Evaluates the configuration expression, not Amplify's live HTTP behavior |
| Delivery integrity | Application source and public assets match the AWS-copy baseline. Verification tooling, GitHub workflows and the patched build-tool lockfile changed; no native-iOS/backend build is claimed |

The machine-readable summary is [verification.json](verification.json). Existing unit tests intentionally fail network access while exercising local terminal answers. This does not mean that opening the website or following an external project link requires no network.

### Documentation layout verification

The README, architecture, evaluation and testing documents were previewed at 1280 px and 390 px widths. All eight views loaded their images without page or table overflow. Browser-rendered SVG measurements found no clipped labels across 25 diagram cards. This checks a standard Markdown preview, not every Markdown application.

- [Desktop diagram in the README](screenshots/document-layout-desktop.png)
- [Mobile test-report alignment](screenshots/document-layout-mobile.png)

Diagrams display as PNG images without requiring Mermaid support. Full-size PNG links and editable SVG versions accompany each diagram. The original Mermaid notation remains in SVG metadata for reference.

## GitHub CI and dependency audit

The [CI workflow](../.github/workflows/ci.yml) runs the same suite on Linux, macOS and Windows and saves JUnit/TAP reports. Local execution generated reports for all 1,794 passing cases. Actual runner results are available under [GitHub Actions](https://github.com/srivilliamsai/portfolio/actions); a local run is not evidence that remote jobs passed. The [CI guide](CI.md) explains the example origin and inspection-only build artifact.

A fresh npm registry audit initially identified two high-severity build-tool dependency findings. Compatible updates to Vite 6.4.5 and source-map-js 1.2.2 resolved them; a clean follow-up audit reported zero known vulnerabilities. Audit results are point-in-time, not a guarantee that future advisories or application vulnerabilities are absent.

## Browser product evidence

The desktop screenshot below was supplied by the owner on 3 November 2026. The mobile and terminal screenshots are from the earlier isolated local production preview of the AWS project's matching source. They show the product and discovery path; they are **not AWS deployment evidence**. The browser observations in `verification.json` describe the specific interactions executed. They do not certify every page, browser, physical device or accessibility technology.

| View | Screenshot |
|---|---|
| Desktop homepage | [Owner-provided desktop](screenshots/portfolio-desktop.png) |
| Mobile menu with the Terminal option | [Local mobile menu](screenshots/local-mobile-menu.png) |
| Personal story interaction | [Local terminal story](screenshots/local-terminal-story.png) |
| Glassora project and pricing follow-up | [Local terminal follow-up](screenshots/local-terminal-followup.png) |

## Deployed and manual acceptance scenarios

This table retains the earlier manual acceptance checklist. Current security and deployment evidence is recorded below; physical-device and assistive-technology checks remain manual.

| ID | Scenario and expected outcome | Status |
|---|---|---|
| WEB-01 | Open required section links; About, Skills and Projects remain reachable without Terminal | Public review pending |
| WEB-02 | Inspect desktop/mobile cards; PitStop, Carbon Footprint and Glassora open their own case studies without page overflow | Public review pending |
| NAV-01 | Navigate with the mobile menu, then reopen it; menu links and the internal Terminal option remain usable | Public review pending |
| TERM-01 | Run story; the personal reflection explains the separate Java and SwiftUI projects | Local unit coverage; public review pending |
| TERM-02 | Run porjects, then an unclear input; a unique typo corrects, while ambiguity suggests or clarifies | Local unit coverage; public review pending |
| TERM-03 | Run glassora, then its free; return Glassora’s dated India storefront answer | Local unit coverage; public review pending |
| TERM-04 | Switch to Wyndra and ask its free; unrecorded pricing stays unknown | Local unit coverage; public review pending |
| TERM-05 | Change topic, Clear or reload before a follow-up; context resets and a missing project requires clarification | Local unit coverage; public review pending |
| KEY-01 | Use Tab, Shift+Tab, completion, history and Escape; controls work, the draft restores and focus returns | Final keyboard review pending |
| AWS-01 | Visit and refresh project/blog URLs directly; hosting serves the entry and the correct route renders | Public homepage, blog and case-study deep routes checked on 3 November 2026 |
| AWS-02 | Retrieve image, font and PDF files; return the right file type instead of SPA HTML | Public representative image, font and PDF responses checked on 3 November 2026 |
| AWS-03 | Inspect metadata, sitemap and headers; they match the real origin and intended configuration | Metadata and existing headers checked; new headers require deployment of this revision |
| EXT-01 | Open source, project, résumé, contact and contribution links; destinations remain accessible | External verification pending |
| A11Y-01 | Review physical touch, screen reader and reduced motion; labels, announcements, focus and motion remain useful | Dedicated review pending |

Glassora's embedded download-price record is dated 3 November 2026 for India. It does not promise permanent worldwide pricing or absence of in-app purchases. Open-source contribution records retain their recorded 2 November verification date; they were not reverified against upstream services in this documentation task.

## Interpreting results

A passed source or configuration check is narrower than a successful public workflow. The scanner is focused, not an exhaustive secret/security audit. There is no measured deployed uptime, latency, Web Vitals score, native-app test execution or official competition score in these results. A missing public URL, screenshots or eligibility confirmation remains pending even when local tests pass.

## Security and Production reporting — 3 November 2026

The current local Node 22 suite passes **1,832 tests**, including restricted article markup, unsafe URL schemes, terminal input/history limits, stale/wrong-origin release records, missing/tampered published files, network errors, bounded responses and deployment timeouts. The build checks every emitted release hash against the compiled artifact. The full verification command also checks assets, documentation and production metadata. Workflow YAML passes actionlint 1.7.12.

The production preview uses the actual `customHttp.yml` browser headers. Browser validation covers rendering, the terminal, literal HTML-like command input, mobile navigation and an article deep route. This is a targeted browser check, not a complete accessibility or penetration test. The new Production workflow supplies ongoing public commit/file verification after a push; its actual outcome is available in GitHub Actions and the repository environment.

The focused credential scan and npm lockfile audit are point-in-time checks. No claim is made about the complete Git history, every upstream dependency, AWS account permissions or separately hosted app backends.
