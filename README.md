# Prestige Routes

Next.js site for tours, accounts, Stripe checkout, and an admin panel.

## Local

```bash
npm install
npx prisma db push
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`:

```bash
npm.cmd run dev
```

## cPanel (Node.js)

1. Upload the project or deploy via Git in your application root.
2. In **Node.js**, set **Application root**, **Application URL**, and **Node.js version** (20+).
3. **Run NPM Install**, then set environment variables from `.env.example`.
4. **Application startup** is usually `npm run start` after building.
5. Run **`npm run build`** once in cPanel Terminal or SSH.
6. Use a **SQLite absolute path** for `DATABASE_URL` under your home directory, then `npx prisma db push`.

Stripe webhook: `https://your-domain.com/api/webhooks/stripe`

## Render

This repo includes `render.yaml` for a Render Blueprint web service.

1. Push this repo to GitHub.
2. In Render, create a new **Blueprint** from the GitHub repository.
3. Set the secret environment variables Render asks for:
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `AUTH_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. Use the Render service URL or your custom domain for `NEXT_PUBLIC_APP_URL` and `AUTH_URL`.

The blueprint mounts a persistent disk at `/var/data` and stores SQLite at `file:/var/data/prod.db`.
The Render build uses `npm ci`, generates Prisma Client, then builds Next.js. The start command runs
`prisma db push` after the persistent disk is mounted, then binds Next to `0.0.0.0` for Render's web
service routing.
