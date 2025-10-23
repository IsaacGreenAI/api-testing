# Branch Protection Setup Guide

This document explains how to configure branch protection rules for the `main` branch to ensure all CI tests pass before merging pull requests.

## Quick Setup (GitHub CLI)

If you have the GitHub CLI (`gh`) installed, run these commands from the repository root:

```bash
# Enable branch protection with required status checks
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=commons-tests \
  --field required_status_checks[contexts][]=dotnet-unit-tests \
  --field required_status_checks[contexts][]=integration-tests \
  --field required_status_checks[contexts][]=all-tests-passed \
  --field enforce_admins=true \
  --field required_pull_request_reviews[dismiss_stale_reviews]=true \
  --field required_pull_request_reviews[require_code_owner_reviews]=false \
  --field required_pull_request_reviews[required_approving_review_count]=0 \
  --field restrictions=null
```

## Manual Setup (GitHub Web UI)

1. Navigate to your repository on GitHub
2. Click **Settings** → **Branches**
3. Under "Branch protection rules", click **Add rule**
4. Configure the following settings:

### Branch name pattern
```
main
```

### Protection Settings

#### ✅ Require a pull request before merging
- ☑️ Dismiss stale pull request approvals when new commits are pushed

#### ✅ Require status checks to pass before merging
- ☑️ Require branches to be up to date before merging
- **Required status checks** (add these):
  - `commons-tests` - Commons Library Tests
  - `dotnet-unit-tests` - .NET Unit Tests
  - `integration-tests` - API Integration Tests
  - `all-tests-passed` - All Tests Passed (summary job)

#### ✅ Do not allow bypassing the above settings
- ☑️ Enforce all configured restrictions for administrators

### Optional Settings (Recommended)

- ☐ Require signed commits (if your team uses GPG signing)
- ☐ Require linear history (prevents merge commits)
- ☐ Allow force pushes: **Disabled** (recommended)
- ☐ Allow deletions: **Disabled** (recommended)

## Verification

After setting up branch protection:

1. Create a test branch: `git checkout -b test-branch-protection`
2. Make a small change and push
3. Create a pull request to `main`
4. Verify that:
   - ✅ All 4 CI jobs run automatically
   - ✅ PR shows "Merging is blocked" until all checks pass
   - ✅ Status checks are marked as required

## Required GitHub Secrets

**No secrets required for CI workflow!** The CI workflow runs tests only and doesn't need any external credentials.

### Optional: Docker Hub Secrets (for CD workflow - currently disabled)

The CD workflow is currently commented out. When you're ready to enable Docker deployments, you'll need:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `DOCKER_HUB_USERNAME` | Your Docker Hub username | Your Docker Hub account name |
| `DOCKER_HUB_TOKEN` | Docker Hub access token | Create at [Docker Hub → Account Settings → Security](https://hub.docker.com/settings/security) |

See `.github/workflows/cd.yml` for the deployment workflow (currently disabled).

## Workflow Overview

### CI Workflow (`.github/workflows/ci.yml`) ✅ ACTIVE
- **Triggers**: Pull requests to `main`, manual dispatch
- **Jobs**:
  1. Commons Library Tests (Vitest)
  2. .NET Unit Tests (xUnit)
  3. API Integration Tests (Vitest + Playwright)
  4. Summary job (ensures all passed)
- **Runtime**: ~5-8 minutes (parallel execution)
- **No secrets required**

### CD Workflow (`.github/workflows/cd.yml`) 🚧 DISABLED
- Currently commented out (no Docker Hub credentials configured)
- When enabled:
  - **Triggers**: Push to `main` (after PR merge), manual dispatch
  - **Jobs**: Build and push Docker images to Docker Hub
  - **Runtime**: ~3-5 minutes
  - **Requires**: `DOCKER_HUB_USERNAME` and `DOCKER_HUB_TOKEN` secrets

## Testing the Pipeline

### Test CI (Pull Request)
```bash
# Create feature branch
git checkout -b feature/test-ci-pipeline

# Make a change (e.g., update README)
echo "Testing CI" >> README.md
git add README.md
git commit -m "test: verify CI pipeline"

# Push and create PR
git push -u origin feature/test-ci-pipeline
gh pr create --title "Test CI Pipeline" --body "Testing CI workflow"

# Watch the CI workflow run
gh run watch

# Or view in browser
gh pr view --web
```

### Manual Trigger (Optional)
```bash
# Trigger CI workflow manually from any branch
gh workflow run ci.yml

# Watch the workflow
gh run watch
```

## Troubleshooting

### Status checks not appearing
- Ensure the CI workflow has run at least once
- Check that workflow is not disabled in **Actions** tab

### "Required status check is not found"
- Status check names must match job names in `ci.yml`
- Re-run the CI workflow to register status checks

### Docker Compose health checks timeout
- Check Universe Service logs: `docker compose logs` in UniverseService/
- Verify .env file is created correctly
- Ensure ports 5432 and 8080 are not already in use

### Integration tests fail
- Ensure Universe Service is running and healthy before tests
- Check API is responding: `curl http://localhost:8080/health`
- Review test logs in GitHub Actions output

## Additional Resources

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Access Tokens](https://docs.docker.com/security/for-developers/access-tokens/)
