# Security

This portfolio has a static React/Vite frontend on AWS Amplify and a separate WILL API on Lambda. There is no visitor authentication service or portfolio application database. The backend's permanent Gemini key is stored in AWS Secrets Manager.

## Protections

- Amplify applies the headers in [customHttp.yml](customHttp.yml): CSP, HSTS, MIME sniffing protection, framing restrictions, referrer policy, feature permissions and opener isolation.
- Scripts load from the same origin. Inline scripts and eval are not permitted. The early theme bootstrap is a local external script. Non-executable JSON-LD remains available for search metadata.
- React and Framer Motion require inline style attributes. CSP allows those attributes, while keeping stylesheet sources on the same origin. This is a compatibility tradeoff, not a complete defense against every injection.
- Article HTML is maintained in source, not accepted from visitors. The build rejects tags, attributes and link schemes outside a restricted authoring grammar. This validator is not intended to sanitize arbitrary user HTML; introduce a maintained sanitizer and an explicit trust boundary before adding a CMS or visitor-authored content.
- CI validates reachable source, metadata, public assets and artifacts. Reviewed unused source is retained only in the Git-ignored local archive and excluded from the distribution. Dependency audit and Dependabot monitor known package vulnerabilities; GitHub CodeQL scans supported source and workflow languages. Actions are pinned to commit hashes.

## Deployment reporting

The build emits a public `deployment.json` containing only the Git commit, site origin and hashes of the entry HTML, local theme script and compiled JavaScript/CSS. It contains no credentials or environment dump.

After the three CI jobs pass for a push to `main`, the Production job waits for that exact commit on AWS, verifies every listed file hash, and checks that the commit remains the latest `main`. Stale metadata, missing files, altered content and timeouts fail verification. The job reports an existing Amplify deployment; it neither starts an AWS build nor needs AWS credentials. This is a public consistency check, not a cryptographic attestation from AWS.

## Reporting a concern

Use the repository's private vulnerability reporting option when available. Otherwise contact the owner through the published professional contact address, describing the affected URL, expected behavior and a minimal reproduction. Do not include live credentials or publish exploitable details in a public issue.

These controls reduce specific risks. Automated checks and a focused review do not establish that the entire site or AWS account is immune to attacks. AWS account access, billing, MFA and unrelated project backends require their own review.

## WILL backend boundary

The assistant server keeps permanent Gemini credentials server-side, validates origins and input sizes, constrains media to approved records, and uses short-lived tokens for Live sessions. Recent conversation is untrusted context, not new biography. The public Function URL is reached through an Amplify rewrite; CORS is not authentication. The in-memory rate limiter is per Lambda instance, not shared quota or a spending cap. Provider quotas and usage monitoring remain account controls. Local typed answers remain available when the backend is unavailable.

The deployment template takes the key through a masked `NoEcho` parameter and gives only the assistant execution role access to its own secret. The API caches that secret for at most five minutes. Stack outputs never contain the key. Seven-day CloudWatch groups receive generic provider status errors; the application does not log questions, audio or credentials. The Lambda adapter uses the platform source IP rather than trusting visitor-supplied forwarding headers.

Real environment files, AWS credential folders, private-key exports, build output and raw review logs are ignored by Git. Only empty/example environment templates are committed. Distribution checks recognize both legacy `AIza` and newer `AQ.` Gemini key formats. Replace a key shared in chat or committed accidentally, then update it privately in Secrets Manager; removing a file from Git does not revoke a credential.

The welcome microphone meter is local and does not record or transmit audio. Recognition/provider voice has a separate action; browser recognition may use the browser vendor’s service, and enabled cloud voice sends audio to Google. Closing, switching to typing or hiding the page stops capture. See [WILL](docs/VILL.md) for behavior and configuration.
