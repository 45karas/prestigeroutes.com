## Prestige Routes (Laravel) — cPanel deploy

This folder contains the full Laravel version of your site.

### 1) Upload
- Upload the **contents of `laravel/`** into a folder on your hosting (recommended): `prestigeroutes/`

### 2) Point the domain to `/public`
Best practice:
- Set your domain document root to: `prestigeroutes/public`

If cPanel does NOT let you change document root:
- Put the Laravel project in `prestigeroutes/`
- Keep `public/` inside it
- Then in `public_html/index.php` require `../prestigeroutes/public/index.php` (I can add that wrapper if needed)

### 3) Install dependencies
In cPanel Terminal (inside the Laravel folder):
```bash
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
```

### 4) Configure `.env`
Set MySQL credentials + Stripe keys + APP_URL.

### 5) Migrate + seed
```bash
php artisan migrate
php artisan db:seed
```

Seed creates:
- Admin: `admin@prestigeroutes.com` / `PrestigeAdmin2026!`

### 6) Permissions (if needed)
```bash
chmod -R 775 storage bootstrap/cache
```

### 7) Stripe webhook
Webhook URL:
- `https://prestigeroutes.com/stripe/webhook`

Events:
- `checkout.session.completed`

