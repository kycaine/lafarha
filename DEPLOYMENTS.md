# Deployment Configurations

## Environments

### Development (Branch: `dev`)
- **Cloudflare Pages (Frontend)**: `dev-farha` (built from `apps/web`)
- **Cloudflare Worker (Backend)**: `dev-farha-worker` (deployed from `apps/api`)

### Production (Branch: `main`)
- **Cloudflare Pages (Frontend)**: `farha` (built from `apps/web`)
- **Cloudflare Worker (Backend)**: `farha-worker` (deployed from `apps/api`)

## Accounts & Authentication
- **Cloudflare Account ID**: `ef964688891b9260ac3e9a712c69cd74`

## Automated CI/CD
Deployment logic and configuration are orchestrated via the monorepo root `package.json` (`npm run deploy:dev` and `npm run deploy:prod`), and integrated with GitHub Actions as documented in `CICD.md`.
