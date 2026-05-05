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
