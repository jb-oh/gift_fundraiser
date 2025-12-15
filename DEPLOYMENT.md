# Deployment Guide

This guide explains how to set up and deploy the Gift Fundraiser application in different environments.

## Environment Configuration

The application supports two environments:
- **Development**: Local development on `http://localhost:3000`
- **Production**: GitHub Pages deployment on `https://jb-oh.github.io/gift_fundraiser`

### How It Works

The application automatically detects the environment and configures URLs accordingly:

- In **development** (`NODE_ENV=development`):
  - Base URL: `http://localhost:3000`
  - No base path added to routes
  - Assets served from root

- In **production** (`NODE_ENV=production`):
  - Base URL: `https://jb-oh.github.io/gift_fundraiser`
  - Base path: `/gift_fundraiser`
  - Assets served with `/gift_fundraiser` prefix

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jb-oh/gift_fundraiser.git
   cd gift_fundraiser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**

   **Note**: The app works without Supabase using localStorage. Skip this step if you just want to test locally.

   For Supabase integration:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Production Deployment (GitHub Pages)

### Prerequisites

- GitHub repository set up with GitHub Pages enabled
- Supabase project created with credentials

### Setup GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Deploy

The application automatically deploys to GitHub Pages when you push to the `main` branch.

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The GitHub Actions workflow will:
1. Install dependencies
2. Build the application with production settings
3. Deploy to GitHub Pages

Your site will be available at: `https://jb-oh.github.io/gift_fundraiser`

### Manual Build for Production

To build for production locally:

```bash
npm run build:prod
```

This will create an `out` directory with static files ready for deployment.

### Testing Production Build Locally

**Important**: You cannot fully test the production build locally with a simple static server because:
1. The production build uses `/gift_fundraiser` as the base path
2. Dynamic routes require GitHub Pages' redirect mechanism
3. Local servers don't replicate this environment

**Options for testing**:

1. **Use development mode for local testing** (Recommended):
   ```bash
   npm run dev
   ```
   This gives you the full experience without base path complications.

2. **Preview the static files** (Limited testing):
   ```bash
   npm run preview
   ```
   Opens the build at `http://localhost:3000`, but:
   - Home page will work
   - Dynamic routes (e.g., `/funding/123`) will show 404
   - This is expected and will work correctly on GitHub Pages

3. **Best approach**: Deploy to GitHub Pages and test there
   - The actual deployment is the only true test
   - GitHub Pages handles the base path and redirects correctly
   - If build succeeds, deployment will work

## Environment Variables Reference

| Variable | Required | Description | Default (Dev) | Default (Prod) |
|----------|----------|-------------|---------------|----------------|
| `NODE_ENV` | Auto-set | Environment mode | `development` | `production` |
| `NEXT_PUBLIC_BASE_URL` | Optional | Full base URL | `http://localhost:3000` | `https://jb-oh.github.io/gift_fundraiser` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL | - | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key | - | - |

## URL Generation

The application uses the `getFullUrl()` helper function from `lib/env.ts` to generate correct URLs in both environments:

```typescript
import { getFullUrl } from '@/lib/env';

// Automatically generates the correct URL based on environment
const shareUrl = getFullUrl(`/funding/${funding.id}`);
// Development: http://localhost:3000/funding/123
// Production: https://jb-oh.github.io/gift_fundraiser/funding/123
```

## Troubleshooting

### Issue: "Failed to fetch at login" or Supabase connection errors

**Cause**: Supabase environment variables are not configured locally.

**Solution**: The app automatically falls back to localStorage when Supabase is not configured. You have two options:

1. **Work without Supabase (Quick Start)**:
   - The app will automatically use localStorage
   - All features work locally
   - Data is stored in browser storage
   - Just ignore the console warning

2. **Set up Supabase (Full Setup)**:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials and restart dev server.

### Issue: Pages showing localhost URLs in production

**Cause**: The URL generation is using `window.location.origin` which doesn't include the base path.

**Solution**: This has been fixed by using the `getFullUrl()` helper function. Make sure you're using the latest version of the code.

### Issue: 404 errors on page refresh in production

**Cause**: GitHub Pages doesn't natively support client-side routing.

**Solution**: The app includes a `404.html` file that redirects to the index page with the correct path. This is automatically copied during the build process.

### Issue: Assets not loading in production

**Cause**: Missing base path in Next.js configuration.

**Solution**: The `next.config.ts` file is already configured with the correct `basePath` and `assetPrefix` for production.

## Switching Between Environments

### To run in development mode:
```bash
npm run dev
```

### To build for development (testing static export locally):
```bash
npm run build:dev
```

### To build for production:
```bash
npm run build:prod
```

## Configuration Files

- **[next.config.ts](next.config.ts)**: Next.js configuration with environment-specific settings
- **[lib/env.ts](lib/env.ts)**: Environment utility functions and configuration
- **[.github/workflows/deploy.yml](.github/workflows/deploy.yml)**: GitHub Actions deployment workflow
- **[.env.example](.env.example)**: Template for environment variables

## Best Practices

1. **Never commit** `.env.local` or any file containing secrets
2. **Always use** `getFullUrl()` helper for generating shareable URLs
3. **Test locally** before pushing to production
4. **Check GitHub Actions** logs if deployment fails
5. **Keep Supabase keys** secure and rotate them if exposed

## Support

For issues or questions:
- Check the [main README](README.md)
- Review [GitHub Actions logs](https://github.com/jb-oh/gift_fundraiser/actions)
- Open an issue on GitHub
