# Working on the AWS portfolio

Source repository: [srivilliamsai/portfolio](https://github.com/srivilliamsai/portfolio). This repository contains the AWS version; the separate Vercel project is not part of this checkout.

Use Node.js 22, run `npm ci`, and create a `codex/` feature branch for changes. Run `npm run verify` before opening a pull request against `main`. For reports matching CI, use `npm run verify:ci`; the generated `test-results/` and `dist/` directories are ignored by Git.

Keep project descriptions in the shared data records, preserve existing routes, and add regression cases for changes to terminal matching, context or keyboard behavior. Check visible changes on both desktop and mobile. Do not replace unknown personal or project facts with guesses.

The [CI guide](docs/CI.md) explains workflow triggers and reports. Changes should pass all three operating-system jobs and the dependency audit when it runs. Review dependency updates before merging; Dependabot does not auto-merge.

GitHub workflows verify code and retain inspection artifacts. They do not deploy the site or submit the challenge entry. Follow [DEPLOYMENT.md](DEPLOYMENT.md) when the owner is ready to deploy.
