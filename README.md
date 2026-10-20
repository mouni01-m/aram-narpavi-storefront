# Aram Narpavi Herbals storefront

This repository contains the Aram Narpavi Herbals Next.js App Router storefront. The homepage, catalogue, product previews, informational pages and session-local cart prototype use development content. Draft support, policy, product and cart pages are excluded from indexing; Shopify, checkout and contact delivery are not configured yet.

## Prerequisites

- Node.js 20.9 or later (required by the installed Next.js version)
- npm (the repository includes `package-lock.json`)

## Install and run locally

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The development server and production build work without Shopify credentials. Copy `.env.example` to `.env.local` only when configuring a feature that needs environment values. `.env.local` is ignored by Git; never commit real credentials.

Shopify settings are checked on the server when a future Shopify feature requests them. Missing Shopify configuration does not prevent local development or a production build. No Shopify API calls have been implemented.

## Quality commands

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

`npm run start` serves the most recent production build. The App Router uses the existing Cache Components and Partial Prefetching configuration in `next.config.ts`.

## Environment setup

See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for the variable contract and which features require each value. Add credentials only to a local ignored env file or the relevant deployment secret store. Never prefix private credentials with `NEXT_PUBLIC_`.
