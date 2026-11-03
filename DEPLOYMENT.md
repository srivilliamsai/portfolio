# AWS Amplify deployment

Status: live at [AWS Amplify](https://main.d229cwpntq8yz1.amplifyapp.com). Source: [srivilliamsai/portfolio](https://github.com/srivilliamsai/portfolio). The connected `main` branch builds on Amplify. The instructions below also document how to reproduce the hosting setup.

The GitHub Production job verifies the exact public commit and hashes before reporting success. It does not initiate a second deployment or store AWS keys. See [SECURITY.md](SECURITY.md) and [CI.md](docs/CI.md).

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
5. Apply the JSON in `deployment/amplify-rewrites.json` through Hosting → Rewrites and redirects. Committing the file alone does not configure the console. The rule allows client application paths and excludes the site's asset extensions. [AWS SPA rewrite reference](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html).
6. Confirm the header settings are applied to the actual hosted responses. Configuration text alone is not runtime evidence.
7. Deploy when ready. Record the actual live URL, public source URL, successful job and verification date in the README, submission draft and testing record.

## Public verification after deployment

- Open the HTTPS homepage without authentication, then use Projects, Skills, About me and Contact.
- Open and refresh each project route, the blog index and at least one individual article directly. The full route catalog is in `src/app/routeCatalog.js`.
- Load a real image, font and résumé PDF. Confirm file responses have the correct content types; asset requests must not receive the SPA HTML.
- Check canonical/social metadata, `/robots.txt` and `/sitemap.xml` use the actual AWS origin. Inspect route metadata after navigation as well as entry-page HTML.
- Open Terminal through desktop navigation and the mobile menu. Complete `story` and the Glassora follow-up sequence, then close it and resume normal navigation.
- Verify required links, response headers and current mobile/keyboard behavior. Use the scenarios in [TESTING.md](docs/TESTING.md).

## Evidence to capture

Capture the successful Amplify job, repository/branch and build/output settings, applied rewrite/header configuration, and the actual public site. Hide credentials and unnecessary account identifiers. Keep local product screenshots labelled as local; they do not demonstrate AWS deployment.

The service intended for this project is Amplify Hosting. No independently provisioned S3 bucket, CloudFront distribution, Lambda function, API Gateway or database is part of the portfolio configuration. Do not list a service as used merely because a separate featured project mentions it.

## Recovery and availability

For build failures, confirm Node 22, the lockfile, `VITE_SITE_URL` and artifact directory, then inspect the failed step. For direct-link failures, check the hosting rewrite. For missing assets, verify the file exists in `dist` and its extension bypasses the fallback. If an unversioned static image looks stale, inspect its cache headers and the deployed artifact.

Retain the last working deployment while fixing a failed replacement. Keep the final site available throughout the official judging window and verify the current deadline/window against the official rules before submitting. No uptime or deployment success is claimed by these instructions.
