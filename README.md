# HardwareTools E-Commerce Platform

A modern, full-stack e-commerce platform for selling industrial and warehouse tools. Built with Next.js 16, React 19, TypeScript, and PostgreSQL.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

## 📚 Documentation

- **[BUILD_SUMMARY.md](./BUILD_SUMMARY.md)** - Overview of what's been built
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Detailed status, roadmap, and architecture
- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Comprehensive local development guide

## ✨ Features

### Phase 1: Core E-Commerce ✅
- Product catalog with search and filtering
- Shopping cart and checkout
- Multiple payment methods (Stripe, M-Pesa, COD)
- User authentication with Better Auth
- Order management and tracking

### Phase 2: Admin Dashboard ✅
- Role-based access control (RBAC)
- Product management (CRUD)
- Order tracking and updates
- Customer analytics
- Admin audit logging

### Phase 2.2: Customer Features ✅
- **Wishlist System** (NEW!)
  - Save products with heart button
  - Dedicated wishlist page
  - Database persistence
  - Real-time updates

### Phase 3+: Planned
- Product reviews and ratings
- Product comparison
- Advanced payment integrations
- Warehouse management
- Email notifications

## 🏗️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19, Next.js 16, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Backend | Next.js API Routes, Server Actions |
| Database | Neon PostgreSQL, Drizzle ORM |
| Auth | Better Auth (email/password) |
| Payments | Stripe, M-Pesa, (Flutterwave, Paystack coming) |

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Storefront
│   ├── admin/                # Admin dashboard
│   ├── wishlist/             # Wishlist page
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Checkout flow
│   └── api/                  # API endpoints
├── components/
│   ├── product-card.tsx      # Product grid item
│   ├── wishlist-button.tsx   # Wishlist toggle
│   └── admin-layout.tsx      # Admin sidebar
├── lib/
│   ├── auth.ts               # Authentication config
│   ├── admin-auth.ts         # RBAC utilities
│   └── db/                   # Database setup
├── BUILD_SUMMARY.md          # Build overview
├── PROJECT_STATUS.md         # Detailed status
└── LOCAL_SETUP.md            # Setup guide
```

## 🗄️ Database Schema

**14 Tables:**
- Authentication: `user`, `session`, `account`, `verification`
- E-Commerce: `categories`, `products`, `cart`, `orders`, `order_items`, `payments`, `addresses`
- Features: `admin_logs`, `wishlist`, `reviews`

## 🔐 User Roles

- **Customer** - Browse, search, cart, checkout, wishlist
- **Warehouse Staff** - View orders, products, analytics
- **Manager** - All staff + edit products, update orders
- **Admin** - Full access + audit logs

## 💳 Payment Methods

- **Stripe** (test mode ready)
- **M-Pesa** (test mode ready)
- **Cash on Delivery**
- Flutterwave & Paystack (coming Phase 2.2)

## 📱 Key Pages

### Public
- `/` - Storefront with products
- `/products/[id]` - Product details
- `/sign-in` - Login
- `/sign-up` - Registration

### Customer (Protected)
- `/cart` - Shopping cart
- `/checkout` - Multi-step checkout
- `/wishlist` - Saved products
- `/orders` - Order history

### Admin (Protected + RBAC)
- `/admin/dashboard` - Analytics & KPIs
- `/admin/products` - Product management
- `/admin/orders` - Order tracking
- `/admin/customers` - Customer analytics

## 🔌 API Endpoints

### Customer
- `GET /api/products` - List products
- `POST /api/cart` - Add to cart
- `GET/POST/DELETE /api/wishlist` - Wishlist operations
- `POST /api/orders` - Create order

### Admin
- `GET /api/admin/dashboard-stats` - Analytics
- `GET/POST/PATCH/DELETE /api/admin/products` - Product CRUD
- `GET/PATCH /api/admin/orders` - Order management
- `GET /api/admin/customers` - Customer list

## 🛠️ Environment Variables

Required in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
MPESA_CONSUMER_KEY="..."
MPESA_CONSUMER_SECRET="..."
MPESA_PASSKEY="..."
```

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed credential setup.

## 🧪 Testing

### Stripe Test Card
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

### Customer Flow
1. Sign up → Browse products → Wishlist → Cart → Checkout → Pay

### Admin Flow
1. Promote user to admin → Dashboard → Manage products/orders

## 📊 Status

| Phase | Status | Features |
|-------|--------|----------|
| 1 | ✅ Complete | Core MVP |
| 2 | ✅ Complete | Admin Dashboard |
| 2.2 | ✅ Complete | Wishlist |
| 2.2 | 🔄 In Progress | Reviews, Comparison, Advanced Payments |
| 3+ | 📋 Planned | Warehouse, Suppliers, Analytics |

## 📦 Installation & Deployment

### Local Development
See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for:
- Credential setup
- Database configuration
- Running tests
- Troubleshooting

### Production Deployment
Deploy to Vercel with one click:
```bash
git push
# Vercel auto-deploys
```

Or deploy to Railway, Render, or self-hosted Node.js environment.

## 🤝 Contributing

The codebase is well-structured for adding features:

1. **Add a new page**: Create in `app/` directory
2. **Add server action**: Create in `app/actions/`
3. **Add API route**: Create in `app/api/`
4. **Add component**: Create in `components/`
5. **Add database table**: Update `lib/db/schema.ts`

## 📞 Support

- 📚 Check [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed documentation
- 🚀 See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for setup help
- 💻 Review [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) for feature overview

## 📄 License

MIT License - See LICENSE file for details

---

## 🎯 Next Steps

1. ✅ **Phase 1** - Core MVP
2. ✅ **Phase 2** - Admin Dashboard
3. ✅ **Phase 2.2** - Wishlist (NEW!)
4. 🔄 **Phase 2.2** - Product Reviews & Advanced Payments
5. 📋 **Phase 3** - Warehouse & Supplier Management
6. 📋 **Phase 4** - Marketing & Loyalty Features

**Start building locally:** See [LOCAL_SETUP.md](./LOCAL_SETUP.md)

