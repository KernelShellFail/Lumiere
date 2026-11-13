## Deploy to GitHub Pages

This site is configured for deployment to GitHub Pages via GitHub Actions.

### Option 1: Automatic (GitHub Actions)

1. Push your code to a repository owned by `KernelShellFail` (e.g. `KernelShellFail/lumiere`).
2. Go to **Settings → Pages** in your repository.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Push to the `main` branch — the workflow at `.github/workflows/deploy.yml` will build and deploy automatically.
5. Your site will be live at `https://kernelshellfail.github.io/lumiere/`.

The workflow sets `BASE_URL=/lumiere/`. If you deploy to a user/organization site
(`kernelshellfail.github.io` directly), change the `BASE_URL` env var in the
workflow to `/`.

### Option 2: Manual

```bash
npm run build
npx gh-pages -d dist
```

---

### Personalization

- **Owner:** basiturraza taji
- **Instagram:** [@briixiio](https://instagram.com/briixiio)
- **GitHub:** [KernelShellFail](https://github.com/KernelShellFail)
- **Brand:** Lumière (unchanged)
