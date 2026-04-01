# One-Time Setup Guide

Run these commands once in your terminal to create the repo and publish:

## Step 1: Navigate to the folder
```bash
cd ~/Documents/Claude/outputs/Claude-Adoption
```

## Step 2: Create the GitHub repo and push
```bash
git init
git add .
git commit -m "Initial dashboard deploy"
gh repo create Claude-Adoption --public --source=. --push
```

> If you want a **private** repo (recommended for extra privacy), use:
> ```bash
> gh repo create Claude-Adoption --private --source=. --push
> ```
> Note: GitHub Pages on private repos requires GitHub Pro or a paid plan.

## Step 3: Enable GitHub Pages
```bash
gh api repos/{owner}/Claude-Adoption/pages -X POST -f source='{"branch":"main","path":"/"}' 2>/dev/null || echo "Enable Pages manually: repo Settings > Pages > Source: main branch"
```

Or do it manually:
1. Go to your repo on GitHub
2. Settings > Pages
3. Source: Deploy from a branch
4. Branch: main, folder: / (root)
5. Save

Your site will be live at: `https://<your-username>.github.io/Claude-Adoption/`

## Privacy protections already in place:
- Password gate (password: Adoption)
- robots.txt blocks all search engine crawlers
- Meta noindex/nofollow on all pages
- No sitemap
- 404 page with noindex
