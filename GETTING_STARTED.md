# Getting Started - HardwareTools Local Development

## 📋 What's Been Built

✅ **Complete e-commerce platform** with:
- Customer storefront with product browsing
- Shopping cart and checkout
- User authentication
- Payment processing (Stripe, M-Pesa, COD)
- Admin dashboard with role-based access
- Product management system
- Order tracking
- **NEW: Wishlist functionality** ❤️
- Database with 14 tables

Total: **50+ files, 1000+ lines of code** across frontend, backend, and database.

---

## 🚀 Start Here: 3 Minute Setup

### Step 1: Install Dependencies
```bash
cd /vercel/share/v0-project
pnpm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env.local
```

### Step 3: Add Credentials (See below for each one)

### Step 4: Start Dev Server
```bash
pnpm dev
```

**That's it!** Visit http://localhost:3000

---

## 🔑 Getting Credentials (Copy-Paste Instructions)

### 1️⃣ Database: Neon PostgreSQL

1. Go to https://console.neon.tech
2. Click "Create a new project"
3. Select region (closest to you)
4. Copy the "Connection string" (looks like: `postgresql://user:password@host/db?sslmode=require`)
5. Add to `.env.local`:
```env
DATABASE_URL="paste-here"
```

**Why:** Stores all your data (products, orders, users, wishlist)

---

### 2️⃣ Authentication: Better Auth Secret

Generate a random 32-byte secret:

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

**On Windows:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Maximum 256)}))
```

Copy the output and add to `.env.local`:
```env
BETTER_AUTH_SECRET="paste-your-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

**Example:** `abc123def456ghi789jkl012mnopqrs+/WXYZ=`

**Why:** Secures user logins and session management

---

### 3️⃣ Payments: Stripe (Test Mode)

1. Go to https://dashboard.stripe.com
2. Click "Create account" or log in
3. You'll land on dashboard in **Live mode**
4. **Toggle "Test mode"** (upper right corner)
5. Click "Developers" → "API Keys"
6. Copy both keys:
   - Publishable key (pk_test_...) 
   - Secret key (sk_test_...)

Add to `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_paste-here"
STRIPE_SECRET_KEY="sk_test_paste-here"
```

**Test Card (in test mode):**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
Cardholder Name: Any name
```

**Why:** Process Stripe payments in test mode without real charges

---

### 4️⃣ Payments: M-Pesa (Optional - Daraja API)

1. Go to https://developer.safaricom.co.ke
2. Sign up/log in
3. Create a new app in developer portal
4. You'll receive:
   - Consumer Key
   - Consumer Secret
   - Passkey (or generate from app settings)
5. Test short code: `174379` (provided by Safaricom)

Add to `.env.local`:
```env
MPESA_CONSUMER_KEY="paste-consumer-key"
MPESA_CONSUMER_SECRET="paste-consumer-secret"
MPESA_PASSKEY="paste-passkey"
MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_CALLBACK_URL="http://localhost:3000/api/payments/mpesa/callback"
```

**Why:** Accept M-Pesa payments from East Africa (Kenya, Uganda, Tanzania)

---

## 📝 Complete `.env.local` Template

```env
# DATABASE
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# AUTHENTICATION
BETTER_AUTH_SECRET="generated-32-byte-secret"
BETTER_AUTH_URL="http://localhost:3000"

# STRIPE (Test Mode - Required)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_secret_key"

# M-PESA (Optional - Only if using M-Pesa)
MPESA_CONSUMER_KEY="your_consumer_key"
MPESA_CONSUMER_SECRET="your_consumer_secret"
MPESA_PASSKEY="your_passkey"
MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_CALLBACK_URL="http://localhost:3000/api/payments/mpesa/callback"

# FLUTTERWAVE & PAYSTACK (Phase 2.2 - Not needed yet)
# FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST_xxx"
# FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST_xxx"
# PAYSTACK_PUBLIC_KEY="pk_test_xxx"
# PAYSTACK_SECRET_KEY="sk_test_xxx"
```

---

## ✅ Checklist: Before Running `pnpm dev`

- [ ] Run `pnpm install`
- [ ] Create `.env.local`
- [ ] Add `DATABASE_URL` (from Neon)
- [ ] Add `BETTER_AUTH_SECRET` (generated)
- [ ] Add Stripe keys (from Dashboard in Test Mode)
- [ ] Save `.env.local`

**Note:** The M-Pesa keys are optional - the app works fine with just Stripe and COD

---

## 🎮 First Things to Try

### 1. View the Storefront
```
http://localhost:3000
```
- See 8 sample products
- Browse by category
- Try search

### 2. Create an Account
```
http://localhost:3000/sign-up
```
- Use any email/password
- Auto-logged in after signup

### 3. Test Wishlist (NEW!)
- Click heart icon on any product card
- Heart fills and turns red
- Go to http://localhost:3000/wishlist
- See your saved products

### 4. Test Shopping Cart
- Click "Add to Cart"
- Go to http://localhost:3000/cart
- Update quantities
- Proceed to checkout (test only)

### 5. Access Admin Dashboard
**First, promote your user to admin:**

Open terminal and run:
```bash
psql $DATABASE_URL
```

In the database shell, run:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
```

Then visit:
```
http://localhost:3000/admin/dashboard
```

---

## 📚 Documentation Files

Open these to learn more:

- **[README.md](./README.md)** - Overview and quick reference
- **[BUILD_SUMMARY.md](./BUILD_SUMMARY.md)** - What's been built (detailed)
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Full architecture and roadmap
- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Detailed setup guide with troubleshooting

---

## 🆘 Quick Troubleshooting

### "DATABASE_URL is not set"
- Check `.env.local` exists in project root (`/vercel/share/v0-project/.env.local`)
- Check file contains: `DATABASE_URL="postgresql://..."`
- Restart dev server after adding

### "Cannot connect to database"
- Verify connection string format: `postgresql://user:pass@host/db?sslmode=require`
- Test connection: `psql $DATABASE_URL`
- Check Neon project is active (not deleted)

### "Stripe key not working"
- Verify keys are in `.env.local` (not `.env`)
- Make sure "Test mode" is enabled in Stripe dashboard
- Test card: `4242 4242 4242 4242`

### "Admin pages show 403"
- Check you promoted user to admin: `SELECT role FROM "user" WHERE email='...';`
- Run: `UPDATE "user" SET role='admin' WHERE email='your@email.com';`
- Sign out and back in

### Dev server won't start
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear Next.js cache: `rm -rf .next`
- Restart: `pnpm dev`

---

## 🎯 Next Steps After Setup

1. ✅ Get everything running locally (you are here!)
2. ✅ Test customer flow (browse → wishlist → checkout)
3. ✅ Test admin flow (create product, manage orders)
4. 📝 Review [PROJECT_STATUS.md](./PROJECT_STATUS.md) for architecture
5. 🚀 Deploy to Vercel (instructions in PROJECT_STATUS.md)
6. 🔧 Start building Phase 2.2 features (reviews, comparison, etc.)

---

## 📂 Important Files to Know

**Configuration:**
- `.env.local` - Your credentials (create this)
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript config
- `tailwind.config.js` - Tailwind CSS theme

**Source Code:**
- `app/` - All pages, APIs, and server actions
- `components/` - React UI components
- `lib/` - Utilities and database setup

**Key New Files (Wishlist):**
- `app/wishlist/page.tsx` - Wishlist page
- `app/actions/wishlist.ts` - Wishlist logic
- `app/api/wishlist/route.ts` - Wishlist API
- `components/wishlist-button.tsx` - Heart button component

---

## 💡 Pro Tips

1. **Use the correct database connection string:**
   - Go to Neon dashboard
   - Click your project
   - Click "Connection string" tab
   - Copy the full string

2. **Test mode for all payment gateways:**
   - Stripe: Toggle "Test mode" (top right)
   - M-Pesa: Use test short code 174379
   - Never use real payment creds in `.env.local`

3. **Database inspection:**
   ```bash
   psql $DATABASE_URL
   \dt  # List tables
   SELECT * FROM "user";  # View users
   SELECT * FROM products;  # View products
   \q  # Exit
   ```

4. **Clear browser cache if things look weird:**
   - Dev Tools → Application → Clear Site Data
   - Or just do Cmd+Shift+Delete

---

## 🎉 Success!

Once you see this, you're ready to go:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
```

Visit http://localhost:3000 and start testing!

---

**Questions?** Check the docs in this folder or refer to [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed help.

