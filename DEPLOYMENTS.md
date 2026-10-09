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

## GitHub Secrets Setup (Required for CI/CD)
To ensure the automated GitHub Actions pipeline (`ci.yml`) can deploy to Cloudflare successfully, the following repository secrets must be configured in **Settings -> Secrets and variables -> Actions**:

1. **`CLOUDFLARE_API_TOKEN`**: A custom Cloudflare API token with `Edit` permissions for Pages, Workers Scripts, D1, R2, and `Read` permissions for Account Settings. 
2. **`CLOUDFLARE_ACCOUNT_ID`**: Set this to `ef964688891b9260ac3e9a712c69cd74`. **Critical:** Setting this explicitly prevents Wrangler's known bug where it crashes trying to fetch User Memberships during Pages deployment.
3. **`ENV_PRODUCTION`**: The environment variables text block for the `dev` environment. Next.js reads this file (`.env.production`) during `npm run build` to inject frontend secrets (like `NEXT_PUBLIC_API_URL` and Firebase keys).
4. **`ENV_PROD`**: The environment variables text block for the `main` (production) environment.

## Automated CI/CD
Deployment logic and configuration are orchestrated via the monorepo root `package.json` (`npm run deploy:dev` and `npm run deploy:prod`), and integrated with GitHub Actions as documented in `CICD.md`.
