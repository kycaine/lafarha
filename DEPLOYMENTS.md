# Deployment Configurations

## Environments

### Development (Branch: `dev`)
- **Cloudflare Pages (Frontend)**: `dev-farha` (built from `apps/web`)
- **Cloudflare Worker (Backend)**: `dev-farha-worker` (deployed from `apps/api`)
- **Cloudflare D1 Database**: `dev-farha-db`
- **Cloudflare R2 Bucket**: `dev-farha-storage`

### Production (Branch: `main`)
- **Cloudflare Pages (Frontend)**: `lafarha` (built from `apps/web`)
- **Cloudflare Worker (Backend)**: `lafarha-worker` (deployed from `apps/api`)
- **Cloudflare D1 Database**: `lafarha-db`
- **Cloudflare R2 Bucket**: `lafarha-storage`

## Accounts & Authentication
- **Cloudflare Account ID**: `ef964688891b9260ac3e9a712c69cd74`

## Cloudflare Secrets Setup (Runtime)
Agar autentikasi dan komunikasi antar Pages dan Worker berjalan, secrets berikut wajib terpasang di Cloudflare:

1. **Cloudflare Worker (`apps/api`)**:
   - `API_SECRET_KEY`: Kunci rahasia untuk autentikasi API request dari Pages.
   - `MASTER_EMAIL`: Email akun master (`talkto.rezki@gmail.com`).
2. **Cloudflare Pages (`apps/web`)**:
   - `API_SECRET_KEY`: Harus sama persis dengan `API_SECRET_KEY` di Worker.
   - `SESSION_SECRET`: String acak minimal 32 karakter untuk enkripsi cookie session (`iron-session`).

## GitHub Secrets Setup (Required for CI/CD)
To ensure the automated GitHub Actions pipeline (`ci.yml`) can deploy to Cloudflare successfully, the following repository secrets must be configured in **Settings -> Secrets and variables -> Actions**:

1. **`CLOUDFLARE_API_TOKEN`**: A custom Cloudflare API token. Ensure the following **Account** permissions are granted:
   - `D1`: Read & Write
   - `Pages`: Read & Write
   - `Workers R2 Storage`: Read & Write
   - `Workers Scripts`: Read & Write
   - `Account Settings`: Read
2. **`CLOUDFLARE_ACCOUNT_ID`**: Set this to `ef964688891b9260ac3e9a712c69cd74`.
3. **`ENV_DEV`** (atau `ENV_PRODUCTION`): Environment variables untuk build dev (`dev-farha`).
4. **`ENV_PROD`**: Environment variables untuk build production (`lafarha`).

## Automated CI/CD
Deployment logic and configuration are orchestrated via the monorepo root `package.json` (`npm run deploy:dev` dan `npm run deploy:prod`), and integrated with GitHub Actions as documented in `CICD.md`.

