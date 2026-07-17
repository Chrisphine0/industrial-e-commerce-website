# HardwareTools - Local Development Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ or 20+
- pnpm (recommended) or npm
- Git
- A Neon PostgreSQL account

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd hardwaretools

# Install dependencies
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Copy from template
cp .env.example .env.local
```

Add these credentials:

```env
# DATABASE
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# AUTHENTICATION
BETTER_AUTH_SECRET="your-32-byte-base64-secret"
BETTER_AUTH_URL="http://localhost:3000"

# STRIPE (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# M-PESA
MPESA_CONSUMER_KEY="your_key"
MPESA_CONSUMER_SECRET="your_secret"
MPESA_PASSKEY="your_passkey"
MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_CALLBACK_URL="http://localhost:3000/api/payments/mpesa/callback"
```

### 3. Generate BETTER_AUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output to `BETTER_AUTH_SECRET` in `.env.local`

### 4. Start Development Server

```bash
pnpm dev
```

Visit:
- Storefront: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin/dashboard

---

## Getting Credentials

### Neon PostgreSQL

1. Go to https://console.neon.tech
2. Create a new project
3. Copy the connection string from "Connection string" section
4. Example format: `postgresql://username:password@host/database?sslmode=require`
5. Add to `DATABASE_URL` in `.env.local`

### Stripe (Test Mode)

1. Go to https://dashboard.stripe.com
2. Sign up/log in
3. Toggle "Test mode" (top right)
4. Go to "Developers" → "API Keys"
5. Copy:
   - Publishable key (pk_test_...) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key (sk_test_...) → `STRIPE_SECRET_KEY`

**Test card numbers:**
- Visa: `4242 4242 4242 4242`
- Visa (debit): `4000 0566 5566 5556`
- Mastercard: `5555 5555 5555 4444`
- Amex: `3782 822463 10005`

Any future expiry date and any CVC.

### M-Pesa (Daraja API - Test)

1. Go to https://developer.safaricom.co.ke
2. Create an app/account
3. Create a new app in your dashboard
4. You'll get:
   - Consumer Key → `MPESA_CONSUMER_KEY`
   - Consumer Secret → `MPESA_CONSUMER_SECRET`
5. Get Passkey from your app settings → `MPESA_PASSKEY`
6. Use test short code: `174379` → `MPESA_BUSINESS_SHORT_CODE`

**Test M-Pesa credentials:**
- Phone: `254708374149`
- PIN: `12345`

### Flutterwave (Phase 2.2 - Optional)

1. Go to https://dashboard.flutterwave.com
2. Switch to "Test Mode" (left sidebar)
3. Go to "Settings" → "API Keys"
4. Copy:
   - Public key (FLWPUBK_TEST_...) → `FLUTTERWAVE_PUBLIC_KEY`
   - Secret key (FLWSECK_TEST_...) → `FLUTTERWAVE_SECRET_KEY`

### Paystack (Phase 2.2 - Optional)

1. Go to https://dashboard.paystack.com
2. Go to "Settings" → "API Keys & Webhooks"
3. Copy:
   - Public key (pk_test_...) → `PAYSTACK_PUBLIC_KEY`
   - Secret key (sk_test_...) → `PAYSTACK_SECRET_KEY`

---

## Project Structure Overview

```
hardwaretools/
├── app/
│   ├── page.tsx                 # Storefront
│   ├── (auth)/                  # Sign in/up pages
│   ├── admin/                   # Admin dashboard
│   ├── wishlist/                # Wishlist page
│   ├── products/[id]/           # Product details
│   ├── cart/                    # Shopping cart
│   ├── checkout/                # Checkout flow
│   ├── api/                     # API routes
│   └── actions/                 # Server actions
├── components/
│   ├── product-card.tsx         # Product display
│   ├── wishlist-button.tsx      # Wishlist toggle
│   ├── admin-layout.tsx         # Admin sidebar
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── auth.ts                  # Better Auth config
│   ├── admin-auth.ts            # RBAC utilities
│   └── db/
│       ├── index.ts             # Drizzle setup
│       └── schema.ts            # Database tables
└── public/                      # Static files
```

---

## Testing the Application

### Customer Flow

1. **Sign Up**
   - Go to http://localhost:3000/sign-up
   - Enter email and password
   - Click "Create Account"

2. **Browse Products**
   - Homepage shows 8 sample products
   - Filter by category
   - Search products

3. **Wishlist**
   - Click heart icon on product card
   - Icon fills and turns red
   - Go to http://localhost:3000/wishlist to see saved items

4. **Add to Cart**
   - Click "Add to Cart" button
   - Go to http://localhost:3000/cart
   - Update quantities
   - Proceed to checkout

5. **Checkout**
   - Fill shipping address
   - Select payment method (M-Pesa, Stripe, or COD)
   - Complete order

6. **Order Confirmation**
   - See confirmation page
   - Order number displayed
   - Access from account dashboard

### Admin Flow

1. **Promote User to Admin**
   - Log in to Neon console
   - Run: `UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';`
   - Or log in to admin directly if already admin

2. **Access Admin Dashboard**
   - Go to http://localhost:3000/admin/dashboard
   - See KPI cards and analytics

3. **Manage Products**
   - Click "Products" in sidebar
   - Create, edit, or delete products
   - Update stock levels

4. **Manage Orders**
   - Click "Orders" in sidebar
   - Filter by status
   - Update order status
   - View customer info

5. **View Customers**
   - Click "Customers" in sidebar
   - See customer list with order counts
   - Track customer lifetime value

---

## Common Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Type check
pnpm type-check

# Format code
pnpm format

# Seed database (if script exists)
pnpm seed

# Access database directly
psql $DATABASE_URL
```

---

## Troubleshooting

### "DATABASE_URL is not set"
- Check `.env.local` exists in project root
- Verify DATABASE_URL is set correctly
- Restart dev server after updating env vars

### "BETTER_AUTH_SECRET is not set"
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
BETTER_AUTH_SECRET="<generated-secret>"
```

### "Failed to connect to database"
1. Check DATABASE_URL format: `postgresql://user:pass@host/db?sslmode=require`
2. Verify Neon project is active
3. Test connection: `psql $DATABASE_URL`
4. Check firewall/network access

### "Payment integration not working"
- Verify API keys are in `.env.local` (not just `.env`)
- For Stripe: Ensure "Test Mode" is enabled
- For M-Pesa: Check business short code is test code (174379)
- Restart dev server after changing payment keys

### "Admin pages show 403 Unauthorized"
- Sign out and sign back in
- Check user role in database: `SELECT email, role FROM "user";`
- Promote user: `UPDATE "user" SET role = 'admin' WHERE email = 'email@example.com';`

### "Wishlist not persisting"
- Check you're signed in (heart icon visible in header)
- Verify database connection working
- Check browser console for errors
- Try clearing localStorage and cookies

---

## Development Tips

### Adding a New Environment Variable

1. Add to `.env.local`:
```env
MY_NEW_VAR="value"
```

2. If it's client-side accessible, prefix with `NEXT_PUBLIC_`:
```env
NEXT_PUBLIC_MY_VAR="value"
```

3. Use in code:
```typescript
const value = process.env.MY_NEW_VAR
const clientValue = process.env.NEXT_PUBLIC_MY_VAR
```

4. Restart dev server for changes to take effect

### Debugging Server Actions

Add logging in server actions:
```typescript
export async function myAction() {
  console.log("[v0] Action started")
  const result = await db.query.something()
  console.log("[v0] Result:", result)
  return result
}
```

Check terminal output where dev server runs.

### Testing API Endpoints

```bash
# Get wishlist
curl -b cookies.txt http://localhost:3000/api/wishlist

# Add to wishlist
curl -X POST http://localhost:3000/api/wishlist \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}' \
  -b cookies.txt

# Admin dashboard stats
curl -b cookies.txt http://localhost:3000/api/admin/dashboard-stats
```

### Database Inspection

```bash
# Connect to database
psql $DATABASE_URL

# List all tables
\dt

# View table structure
\d products

# Check user roles
SELECT email, role FROM "user";

# View wishlist items
SELECT * FROM wishlist;
```

---

## Next Steps

1. ✅ Complete Wishlist (DONE)
2. Implement Product Reviews
3. Add Product Comparison
4. Implement Advanced Payments (Flutterwave, Paystack)
5. Add Customer Notifications
6. Implement Warehouse Management

See `PROJECT_STATUS.md` for full roadmap.

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Drizzle ORM**: https://orm.drizzle.team
- **Better Auth**: https://www.better-auth.com
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com

