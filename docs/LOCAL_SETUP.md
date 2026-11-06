# Local setup

Development addresses are for working on the project; they are not public submission URLs. Deployment instructions are separate in [DEPLOYMENT.md](../DEPLOYMENT.md).

## Start

Install Node.js 22 and npm, open a terminal at the repository root, then run:

```sh
npm ci
npm run dev
```

The default development address is `http://localhost:3000`. Use the address printed by Vite. The configured port is strict: if it is occupied, stop the other development server or explicitly choose another port:

```sh
VITE_SITE_URL=http://localhost:3001 npm run dev -- --port 3001
```

That environment-variable syntax works in macOS/Linux shells. In Windows PowerShell:

```powershell
$env:VITE_SITE_URL = 'http://localhost:3001'
npm run dev -- --port 3001
Remove-Item Env:VITE_SITE_URL
```

Stop the server with Ctrl+C; after it exits, remove the temporary PowerShell variable as shown. No AI or AWS key is needed to run the website.

## Tests and compiled preview

```sh
npm run verify
npm run preview
```

`verify` runs unit tests, 2,472 local WILL questions, the asset and reachable-source checks, local documentation links, the Vite build and artifact validation. The preview serves the generated `dist/` locally. When using a temporary `VITE_SITE_URL`, keep the same value for the build and its artifact check. The preview has the same strict default port; `--port 3001` can be used if needed.

`.env.example` describes the public site-origin variable. If you create a local environment file, keep it out of version control. Public `VITE_*` values become part of browser assets; they are not a place for secrets.

Vite mounts `/api/assistant` for local answers. To use Gemini locally, copy `.env.assistant.example` to the ignored `.env.assistant.local`, set the key privately and choose `ASSISTANT_PROVIDER=gemini`, then restart Vite. `npm run assistant:api` runs the standalone handler on loopback port 3002. Production uses the separate [CloudFormation connection](../deployment/CONNECT_WILL.md); local environment files are never uploaded to Amplify or committed.

## Folder roles

`src/` is the application; `public/static/` holds required files; `config/` and `vite.config.js` support the build; `scripts/` holds verification and portable test-runner tools; `tests/` contains the automated cases; `docs/` holds this review material. Dependency/build directories and test reports are generated locally and ignored by Git. Reviewed unused files are preserved in `.local-archive/`, with a manifest, and are excluded from Git and the website build.

## GitHub checks

Use `npm run verify:ci` to generate JUnit and TAP reports in `test-results/`. The repository workflows also run this command on Linux, macOS and Windows. See [CI.md](CI.md) for triggers, artifacts and scope.
