# syalamanchili.dev — Portfolio

Personal portfolio site for Sundeep Yalamanchili. Built with React + Vite, deployed on GitHub Pages with a custom domain.

## Quick Start (Local)

```bash
npm install
npm run dev
```

## Deploy to syalamanchili.dev

### Step 1: Buy the domain
1. Go to [Cloudflare Registrar](https://dash.cloudflare.com) → Domain Registration → Search `syalamanchili.dev`
2. Purchase (~$11/year). Cloudflare becomes your registrar AND DNS provider.

### Step 2: Create GitHub repo & push
```bash
cd portfolio-site
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/yalamanchili7/syalamanchili.dev.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The deploy workflow (`.github/workflows/deploy.yml`) will auto-run on push to `main`
4. Under **Custom domain**, enter `syalamanchili.dev` and click Save
5. Check **Enforce HTTPS** (required for .dev domains)

### Step 4: Configure DNS in Cloudflare
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → select `syalamanchili.dev` → **DNS**
2. Add these records:

| Type  | Name | Content             | Proxy |
|-------|------|---------------------|-------|
| A     | @    | 185.199.108.153     | DNS only |
| A     | @    | 185.199.109.153     | DNS only |
| A     | @    | 185.199.110.153     | DNS only |
| A     | @    | 185.199.111.153     | DNS only |
| CNAME | www  | yalamanchili7.github.io | DNS only |

**Important:** Set proxy status to **DNS only** (gray cloud), not Proxied. GitHub Pages handles SSL for .dev domains.

3. Under **SSL/TLS** → set mode to **Full**

### Step 5: Wait & Verify
- DNS propagation takes 5–30 minutes
- GitHub will auto-provision an SSL certificate
- Visit `https://syalamanchili.dev` — your portfolio should be live!

## Updating the site
Just push to `main` — GitHub Actions will auto-build and deploy:
```bash
git add .
git commit -m "Update portfolio"
git push
```

## Tech Stack
- React 18
- Vite 5
- Google Fonts (Playfair Display, Source Sans 3, IBM Plex Mono)
- GitHub Pages + GitHub Actions CI/CD
- Cloudflare DNS
