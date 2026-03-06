# CI/CD Pipeline

This project uses **GitHub Actions** to automatically build and deploy the dashboard to **GitHub Pages** on every push to `main`.

## Overview

```
Push to main
     │
     ▼
┌─────────────┐
│    build    │  Install deps → Build → Upload artifact
└──────┬──────┘
       │ needs: build
       ▼
┌─────────────┐
│   deploy    │  Deploy artifact to GitHub Pages
└─────────────┘
```

## Workflow file

`.github/workflows/deploy.yml`

## Trigger

| Event | Condition |
|---|---|
| `push` | Only on the `main` branch |
| `workflow_dispatch` | Manual trigger from the GitHub Actions UI |

> Pushes to `dev` or any other branch do **not** trigger a deployment.

## Jobs

### `build`

Runs on `ubuntu-latest`.

| Step | Action / Command | Description |
|---|---|---|
| Checkout | `actions/checkout@v4` | Clone the repository |
| Setup Node | `actions/setup-node@v4` (Node 20) | Set up Node.js with npm cache |
| Install dependencies | `npm ci` | Clean install from `package-lock.json` |
| Build | `npm run build` | Run Vite build, outputs to `dist/` |
| Upload artifact | `actions/upload-pages-artifact@v3` | Package `dist/` for the deploy job |

### `deploy`

Runs on `ubuntu-latest`, only after `build` succeeds (`needs: build`).

| Step | Action | Description |
|---|---|---|
| Deploy to GitHub Pages | `actions/deploy-pages@v4` | Publish the artifact to GitHub Pages |

The deployment URL is captured from `steps.deployment.outputs.page_url` and exposed as the environment URL in the GitHub Actions summary.

## Permissions

The workflow requires the following repository permissions:

| Permission | Level | Reason |
|---|---|---|
| `contents` | `read` | Checkout the repository |
| `pages` | `write` | Deploy to GitHub Pages |
| `id-token` | `write` | OIDC token for trusted deployment |

These are set at the workflow level and follow the principle of least privilege.

## Concurrency

```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```

Only one deployment runs at a time. If a new push triggers the workflow while a previous run is still in progress, the previous run is cancelled automatically. This prevents race conditions and ensures the latest commit is always what gets deployed.

## Branch strategy

```
dev ──── feature work, PRs
  │
  └──► main ──► GitHub Pages (production)
```

- `dev` is the working branch. All development happens here or in feature branches merged into `dev`.
- `main` is the production branch. Merging into `main` triggers the deployment pipeline.
- To deploy, open a Pull Request from `dev` → `main` and merge it.

## Enabling GitHub Pages (one-time setup)

If deploying to a new repository, enable GitHub Pages with the Actions source:

1. Go to **Settings** > **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save — the next push to `main` will deploy the site

## Local build verification

Before merging to `main`, verify the production build locally:

```bash
npm run build
npm run preview
```

This runs the same `vite build` step as the pipeline and serves it at `http://localhost:4173`.
