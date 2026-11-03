# GitHub verification and maintenance

Repository: [srivilliamsai/portfolio](https://github.com/srivilliamsai/portfolio). The default branch is `main`. [View workflow runs](https://github.com/srivilliamsai/portfolio/actions).

## Test and build workflow

[Portfolio CI](../.github/workflows/ci.yml) runs on pushes, pull requests and manual requests. Each job uses Node.js 22 from `.nvmrc`, installs the lockfile with `npm ci`, and runs `npm run verify:ci` on Linux, macOS and Windows.

The verification includes the terminal and portfolio unit suite, route/asset rewrite regression tests, required-asset checks, local documentation links, a production build and artifact validation. Explicit test-file discovery and normalized asset paths support Windows without relying on shell glob expansion or Unix separators.

Invalid XML control characters from negative-input tests are stored as visible `\u0000` notation. Each job saves JUnit (`unit.xml`) and TAP (`unit.tap`) reports for 14 days, including when tests fail after producing reports. The successful Linux job retains the compiled build for seven days. Its example origin exists only to exercise the public-URL build guard. **This artifact is for inspection; it is not the final public deployment.**

## Dependency maintenance

[Dependency audit](../.github/workflows/dependency-audit.yml) checks all locked runtime and build dependencies with `npm audit --audit-level=high`. It runs for dependency changes to `main` or a pull request, every Monday, and manually. Install scripts are disabled in this audit-only job. A registry outage fails the job rather than being reported as a clean scan.

[Dependabot](../.github/dependabot.yml) proposes weekly npm and GitHub Actions updates. Minor/patch npm updates are grouped; major updates remain separate. There is no automatic merge or deployment.

Actions are pinned to verified commit hashes. Verification and audit job permissions are read-only, checkout does not retain credentials, and pull requests use `pull_request` rather than a privileged target trigger. AWS credentials, an AI API key and an Amplify app connection are not required for CI. See [GitHub workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) and [Dependabot options](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference).

## Local reproduction and scope

```sh
npm ci
npm run verify:ci
npm audit --audit-level=high
```

For the deployment-origin guard, set `AWS_APP_ID` and `VITE_SITE_URL` as shown in the workflow, using your shell's environment syntax. `AWS_APP_ID` is only a local guard flag here; these checks do not call AWS. `npm run verify` runs the same checks without generating CI reports. Reports, build output and dependencies are ignored by Git.

CI does not certify public AWS routes, availability, physical-device behavior, screen-reader support, eligibility or a judging score. Those scenarios remain separate in [TESTING.md](TESTING.md). The three matrix `Verify` checks are the required checks for `main`; the Production job is not required before merging because it observes the deployment after a push. Force pushes and branch deletion are blocked. Changes should pass CI on a branch before merging. Amplify deployment settings remain in [DEPLOYMENT.md](../DEPLOYMENT.md).

## Verified Production environment

The `Verify AWS Production` job runs only after the full matrix succeeds for a push to `main`. Pull requests cannot enter this job. It checks out the triggering SHA without retained credentials, waits up to 15 minutes for the public release marker, verifies the entry/theme/bundle hashes, and checks `main` before and after verification. Workflow concurrency cancels superseded runs. A failure or timeout does not produce a successful deployment.

The job uses `contents: read` and `deployments: write`; the latter allows GitHub environment status reporting. There are no AWS access keys, GitHub personal tokens, external artifacts or privileged pull-request triggers. The Production environment permits `main` only. Existing Amplify automation performs the actual hosting deployment.

The metadata is a public consistency check, not AWS-signed provenance. A failed Amplify build leaves the old commit online; the reporter then fails after its bounded wait. Check the Amplify build log for the underlying reason.

GitHub CodeQL default setup scans supported languages weekly and on configured repository events. Dependabot security updates are enabled in addition to the weekly version-update configuration. No automated tool guarantees the absence of application vulnerabilities.

Production records are created explicitly with the deployment API’s `production_environment: true`. The job uses the main-only environment with automatic record creation disabled. It records `in_progress` before public verification, then reports success only when the verification and current-main checks succeed; failure or cancellation reports failure. This avoids relying on GitHub’s automatic environment classification.
