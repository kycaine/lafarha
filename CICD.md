# La Farha CI/CD Guide

This document summarizes the workflow and configuration of the Continuous Integration / Continuous Deployment (CI/CD) pipeline for this project.

## What is CI/CD?
- **CI (Continuous Integration)**: An automated process to verify that new code does not contain errors or break the application (e.g., by running syntax checks and build processes).
- **CD (Continuous Deployment)**: An automated process to release and deploy code to the cloud (in this case, Cloudflare Pages and Workers) after the CI process successfully passes.

## 1. Current CI Configuration
The configuration runs using **GitHub Actions**, which you can find in the `.github/workflows/ci.yml` file.

### When does the CI run?
The CI system will **automatically trigger** whenever there is:
- A direct push to the `main`, `dev`, or `cicd` branch.
- A Pull Request (PR) targeting the `main` or `dev` branch.

### What are the CI stages (Jobs)?
Every time it runs, the CI provisions a free server from GitHub (Ubuntu) and performs:
1. **Checkout Code**: Retrieves the latest source code from your repository.
2. **Setup Node**: Prepares the Node.js version 20 environment.
3. **Install Dependencies**: Runs `npm install` to download all required libraries (`node_modules`) for the workspace.
4. **Linting (`npm run lint`)**: Runs code style checks (ESLint) to ensure there are no typos, unused variables, or minor code smells.
5. **Build (`npm run build`)**: Simulates the final application build (Builds Tailwind CSS and Next.js). If there is a Typescript error or a broken component, this process will fail (show red on GitHub), catching errors before they reach production.

---

## 2. Planned CD Configuration (Automated Deployment)
*Note: This CD step has not been added to GitHub Actions yet to avoid authentication errors.*

Currently, the deployment process is still manual via terminal commands on the local machine:
- `npm run deploy:dev` (For the development environment: `dev-farha`)
- `npm run deploy:prod` (For the production environment: `farha`)

### How CD Will Work When Enabled
Once you are ready to enable CD, GitHub Actions will run the deployment scripts above **only if the CI stage (Lint & Build) is proven successful**.
- Push to `dev` branch -> Automatically deploy to the Development environment.
- Push to `main` branch -> Automatically deploy to the Production environment.

### Additional Requirements for CD
This deployment process calls Cloudflare's internal application (using `wrangler`). For GitHub to "log in" and perform this task on your behalf without requiring a password, you must register **Secrets** (secret variables) in your GitHub repository settings (`Settings -> Secrets and variables -> Actions`):
1. **`CLOUDFLARE_API_TOKEN`**: You can create this API token in the Cloudflare dashboard (with edit permissions for Cloudflare Pages, Workers, and D1).
2. **`CLOUDFLARE_ACCOUNT_ID`**: Your Cloudflare Account ID (which is `ef964688891b9260ac3e9a712c69cd74`).

---
### In Case of Experiment Failure
Since we are working in an isolated branch (`cicd`), your current web app state is guaranteed not to break or go down. If the GitHub Actions experiment fails, simply return (checkout) to the `dev` branch and delete the `cicd` branch.
