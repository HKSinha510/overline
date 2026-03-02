# Database Schema Documentation

## Overview
Overline uses PostgreSQL with Prisma ORM. This document outlines the database structure for shop registration, verification, and management.

## Core Tables

###Users Table (`users`)
Stores user and shop owner information.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Unique user identifier |
| `email` | String (UNIQUE) | User email address |
| `phone` | String (UNIQUE, nullable) | User phone number |
| `hashed_password` | String (nullable) | Bcrypt hashed password |
| `name` | String | User full name |
| `avatar_url` | String (nullable) | Profile picture URL |
| `date_of_birth` | Date (nullable) | User DOB |
| `gender` | String (nullable) | Gender preference |
| `google_id` | String (UNIQUE, nullable) | Google OAuth ID |
| `auth_provider` | String | Auth method: "local" (default) or "google" |
| `role` | Enum | USER, OWNER, STAFF, SUPER_ADMIN |
| `is_active` | Boolean | Account active status |
| `is_email_verified` | Boolean | Email verification status |
| `is_phone_verified` | Boolean | Phone verification status |
| `last_login_at` | DateTime (nullable) | Last login timestamp |
| `otp_code` | String (nullable) | OTP for phone verification |
| `otp_expires_at` | DateTime (nullable) | OTP expiration time |
| `tenant_id` | UUID (FK) | Associated shop owner business |
| **Trust Score Fields** |
| `trust_score` | Float (default: 100) | User reliability score 0-100 |
| `total_bookings` | Int | Total bookings made |
| `completed_bookings` | Int | Successfully completed bookings |
| `no_show_bookings` | Int | Bookings user didn't show up for |
| `cancelled_bookings` | Int | Bookings user cancelled |
| `created_at` | DateTime | Account creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

**Indexes:**
- `email` - For quick user lookup
- `phone` - For phone-based search
- `tenant_id` - For shop-owner queries

---

### Tenants Table (`tenants`)
Represents shop owner businesses/organizations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Unique tenant identifier |
| `name` | String | Business/organization name |
| `type` | Enum | CLINIC, SALON, BARBER, SPA, OTHER |
| `plan` | Enum | FREE (default), BASIC, PROFESSIONAL, ENTERPRISE |
| `is_active` | Boolean | Business active status |
| `created_at` | DateTime | Creation timestamp |
| `updated_at` | DateTime | Update timestamp |

**Relationships:**
- 1:N with Shops (one tenant can have multiple shops)
- 1:N with Users (shop owners belong to a tenant)

---

### Shops Table (`shops`)
Individual shop/service provider information. **This is the main table with verification features.**

| Field | Type | Description |
|-------|------|-------------|
| **Basic Info** |
| `id` | UUID (PK) | Unique shop identifier |
| `tenant_id` | UUID (FK) | Associated business |
| `name` | String | Shop name |
| `slug` | String (UNIQUE) | URL-friendly identifier |
| `description` | String (nullable) | Shop description |
| **Location** |
| `address` | String | Full street address |
| `city` | String | City name |
| `state` | String (nullable) | State/Region |
| `postal_code` | String (nullable) | ZIP/postal code |
| `country` | String (default: "IN") | Country code |
| `latitude` | Decimal (nullable) | GPS latitude for maps |
| `longitude` | Decimal (nullable) | GPS longitude for maps |
| **Contact** |
| `phone` | String (nullable) | Shop contact number |
| `email` | String (nullable) | Shop email |
| `website` | String (nullable) | Shop website URL |
| **Media** |
| `logo_url` | String (nullable) | Shop logo |
| `cover_url` | String (nullable) | Shop cover image |
| `photo_urls` | String[] | Array of shop photos |
| **Settings** |
| `settings` | JSON | Flexible configuration |
| `max_concurrent_bookings` | Int (default: 1) | Booking capacity |
| `auto_accept_bookings` | Boolean (default: true) | Auto-approval mode |
| **🔍 GOOGLE VERIFICATION FIELDS (NEW)** |
| `is_google_verified` | Boolean (default: false) | Google Places verified |
| `is_customer_verified` | Boolean (default: false) | Customer reviews verified |
| `google_place_id` | String (nullable) | Google Places ID |
| `google_rating` | Decimal (nullable, 0-5) | Google average rating |
| `google_reviews_count` | Int (default: 0) | Total reviews count |
| `verification_status` | String (default: "PENDING") | PENDING, GOOGLE_VERIFIED, CUSTOMER_VERIFIED, FULLY_VERIFIED |
| `verification_notes` | String (nullable) | Admin notes on verification |
| `verified_at` | DateTime (nullable) | Verification timestamp |
| **Status** |
| `is_active` | Boolean | Shop active status |
| `created_at` | DateTime | Creation timestamp |
| `updated_at` | DateTime | Update timestamp |

**Verification Status Values:**
- `PENDING` - Awaiting verification
- `GOOGLE_VERIFIED` - Found on Google Places
- `CUSTOMER_VERIFIED` - Customers verified the shop
- `FULLY_VERIFIED` - Both Google and customer verified

**Indexes:**
- `tenant_id` - For business queries
- `slug` - For URL lookups
- `city` - For location search
- `latitude, longitude` - For geospatial queries
- `google_place_id` - For Google verification lookup
- `verification_status` - For admin dashboard filtering

---

### Bookings Table (`bookings`)
User booking records with fraud detection fields.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Booking ID |
| `booking_number` | String (UNIQUE) | Human-readable booking number |
| `user_id` | UUID (FK, nullable) | Booking user (null for walk-ins) |
| `shop_id` | UUID (FK) | Booked shop |
| `staff_id` | UUID (FK, nullable) | Assigned staff |
| `start_time` | DateTime | Appointment start |
| `end_time` | DateTime | Appointment end |
| `total_duration_minutes` | Int | Service duration |
| `total_amount` | Decimal | Booking cost |
| `currency` | String (default: "INR") | Currency code |
| `status` | Enum | PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW, REJECTED |
| `source` | Enum | WEB, MOBILE, WALK_IN, ADMIN |
| `customer_name` | String (nullable) | Guest name |
| `customer_phone` | String (nullable) | Guest phone |
| `customer_email` | String (nullable) | Guest email |
| `queue_position` | Int (nullable) | Queue position |
| `notes` | String (nullable) | Customer notes |
| `admin_notes` | String (nullable) | Admin notes |
| `arrived_at` | DateTime (nullable) | Arrival time |
| `started_at` | DateTime (nullable) | Service start time |
| `completed_at` | DateTime (nullable) | Completion time |
| `cancelled_at` | DateTime (nullable) | Cancellation time |
| `created_at` | DateTime | Creation timestamp |
| `updated_at` | DateTime | Update timestamp |

---

### Refresh Tokens Table (`refresh_tokens`)
OAuth token storage for session management.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Token ID |
| `token` | String (UNIQUE) | JWT refresh token |
| `user_id` | UUID (FK) | Associated user |
| `expires_at` | DateTime | Token expiration |
| `created_at` | DateTime | Creation timestamp |

---

## Data Flow for Shop Verification

### Shop Registration Flow

```sql
-- 1. User submits registration
INSERT INTO users (email, name, phone, role, ...)
VALUES ('owner@example.com', 'John Doe', '+919876543210', 'OWNER');

-- 2. Tenant created for business
INSERT INTO tenants (name, type)
VALUES ('JohnsDental Clinic', 'CLINIC');

-- 3. Shop created with Google verification
INSERT INTO shops (
  name, address, city, phone,
  is_google_verified, google_place_id, verification_status, verified_at
) VALUES (
  'Johns Dental Clinic', '123 Main St', 'Mumbai', '+919876543210',
  true, 'ChIJrTLr-oCEbDkRnTBSJ58c6Go', 'GOOGLE_VERIFIED', NOW()
);

-- 4. Working hours initialized
INSERT INTO working_hours (shop_id, day_of_week, open_time, close_time)
VALUES 
  (shop_id, 'MONDAY', '09:00', '18:00'),
  (shop_id, 'TUESDAY', '09:00', '18:00'),
  ...

-- 5. Queue stats created
INSERT INTO queue_stats (shop_id, current_waiting_count, estimated_wait_minutes)
VALUES (shop_id, 0, 0);
```

### User Booking with Fraud Detection

```sql
-- 1. User initiates booking
-- Fraud detection checks:
-- - User trust score
-- - Booking velocity (too many bookings in 5 min?)
-- - IP reputation
-- - Device fingerprint

-- 2. If fraud check passes:
INSERT INTO bookings (
  user_id, shop_id, start_time, status, source, ...
) VALUES (...);

-- 3. Queue position assigned based on shop type
-- 4. Notifications sent to user and shop
```

---

## Verification Fields in Admin Dashboard

Shops are displayed with verification badges:

```
┌─────────────────────────────────────┐
│ Johns Dental Clinic                 │
├─────────────────────────────────────┤
│ Address: 123 Main St, Mumbai        │
│ Phone: +919876543210                │
│                                     │
│ [✓ Google Verified] [✓ Customer V.] │
│ Rating: 4.5/5 (24 reviews)          │
│ Verification Status: FULLY_VERIFIED │
│ Verified: March 1, 2026             │
│                                     │
│ Location: 19.0760°N, 72.8777°E      │
└─────────────────────────────────────┘
```

---

## Configuration & Queries

### Get All Verified Shops
```typescript
const verifiedShops = await prisma.shop.findMany({
  where: { isGoogleVerified: true },
  orderBy: { googleRating: 'desc' },
});
```

### Get Pending Verification Shops
```typescript
const pendingShops = await prisma.shop.findMany({
  where: { verificationStatus: 'PENDING' },
  include: { tenant: true },
});
```

### Update Shop After Customer Verification
```typescript
await prisma.shop.update({
  where: { id: shopId },
  data: {
    isCustomerVerified: true,
    verificationStatus: 'FULLY_VERIFIED',
    verifiedAt: new Date(),
  },
});
```

### Get User's Trust Score & Booking History
```typescript
const userStats = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    trustScore: true,
    totalBookings: true,
    completedBookings: true,
    noShowBookings: true,
    cancelledBookings: true,
  },
});
```

---

## Fraud Detection Integration

The system tracks:
- **Login attempts** - Rate limiting, failed attempts
- **Device fingerprints** - IP, User-Agent combinations
- **Booking velocity** - Too many bookings from same IP/user
- **Trust scores** - Based on booking history
- **Suspicious IPs** - Known problematic addresses

Data stored in Redis (temporary) with TTL:
```
fraud:login:{email}:5m - Login attempts in 5 minutes
fraud:device:{userId} - Known devices (30 day TTL)
fraud:failed:{email} - Failed login count (1 hour TTL)
fraud:blocklist:ips - Suspended IP addresses
```

---

## Performance Indexes

Critical indexes for query optimization:

| Table | Columns | Purpose |
|-------|---------|---------|
| shops | (city, is_active) | Location search |
| shops | (latitude, longitude) | Geospatial queries |
| shops | (google_place_id) | Verification lookup |
| shops | (verification_status) | Admin filtering |
| bookings | (user_id, status) | User booking history |
| bookings | (shop_id, start_time) | Shop availability |
| users | (email) | Auth lookup |
| users | (phone) | Phone verification |

---

## Environment Variables Required

```bash
# Google Places API
GOOGLE_PLACES_API_KEY=<your_api_key>
GOOGLE_CLIENT_ID=<your_client_id>
GOOGLE_CLIENT_SECRET=<your_client_secret>

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/overline

# Redis (for fraud detection)
REDIS_URL=redis://localhost:6379
```

---

## Next Steps

1. **Enable Google Places API** in Google Cloud Console
2. **Configure GOOGLE_PLACES_API_KEY** in environment variables
3. **Existing shops** will show as PENDING - wait for customer verification
4. **New shops** are auto-verified if found on Google Places
5. **Admin Dashboard** shows verification badges and status
6. **User Website** displays verified shops with ratings

