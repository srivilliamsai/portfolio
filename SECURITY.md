# Security

This portfolio is a static React/Vite site hosted on AWS Amplify. The developer terminal resolves a bounded set of local commands and questions; it does not execute shell commands or send input to an AI endpoint. There is no portfolio authentication service or application database.

## Protections

- Amplify applies the headers in [customHttp.yml](customHttp.yml): CSP, HSTS, MIME sniffing protection, framing restrictions, referrer policy, feature permissions and opener isolation.
- Scripts load from the same origin. Inline scripts and eval are not permitted. The early theme bootstrap is a local external script. Non-executable JSON-LD remains available for search metadata.
- React and Framer Motion require inline style attributes. CSP allows those attributes, while keeping stylesheet sources on the same origin. This is a compatibility tradeoff, not a complete defense against every injection.
- Terminal input is limited to 400 characters. Recall and displayed output each retain at most 100 entries. User-entered command text is rendered by React as text.
- Article HTML is maintained in source, not accepted from visitors. The build rejects tags, attributes and link schemes outside a restricted authoring grammar. This validator is not intended to sanitize arbitrary user HTML; introduce a maintained sanitizer and an explicit trust boundary before adding a CMS or visitor-authored content.
- CI validates source, metadata, public assets and artifacts. Dependency audit and Dependabot monitor known package vulnerabilities; GitHub CodeQL scans supported source and workflow languages. Actions are pinned to commit hashes.

## Deployment reporting

The build emits a public `deployment.json` containing only the Git commit, site origin and hashes of the entry HTML, local theme script and compiled JavaScript/CSS. It contains no credentials or environment dump.

After the three CI jobs pass for a push to `main`, the Production job waits for that exact commit on AWS, verifies every listed file hash, and checks that the commit remains the latest `main`. Stale metadata, missing files, altered content and timeouts fail verification. The job reports an existing Amplify deployment; it neither starts an AWS build nor needs AWS credentials. This is a public consistency check, not a cryptographic attestation from AWS.

## Reporting a concern

Use the repository's private vulnerability reporting option when available. Otherwise contact the owner through the published professional contact address, describing the affected URL, expected behavior and a minimal reproduction. Do not include live credentials or publish exploitable details in a public issue.

These controls reduce specific risks. Automated checks and a focused review do not establish that the entire site or AWS account is immune to attacks. AWS account access, billing, MFA and unrelated project backends require their own review.
