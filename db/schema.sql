-- ==============================================================================
-- TORQO Relational Database Schema
-- Compatible with SQLite, PostgreSQL, Supabase & Neon
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) UNIQUE NOT NULL,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' CHECK(role IN ('CUSTOMER', 'OWNER', 'ADMIN')),
  profile_photo TEXT,
  agency_name VARCHAR(150),
  gstin VARCHAR(50),
  hub_location VARCHAR(100),
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. BIKES / VEHICLES TABLE (Physical listings with isolated unique IDs)
CREATE TABLE IF NOT EXISTS bikes (
  id VARCHAR(64) PRIMARY KEY, -- e.g. TORQO-BIKE-000001
  owner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  variant VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  registration_number VARCHAR(50),
  category VARCHAR(30) NOT NULL CHECK(category IN ('bike', 'scooter', 'car', 'suv', 'van')),
  sub_category VARCHAR(80),
  fuel_type VARCHAR(30) NOT NULL,
  transmission VARCHAR(30) NOT NULL,
  engine_cc VARCHAR(100),
  mileage VARCHAR(80),
  speed_limit VARCHAR(50),
  seats INTEGER DEFAULT 2,
  price_per_hour REAL,
  price_per_day REAL NOT NULL,
  security_deposit REAL NOT NULL,
  free_km_per_day INTEGER DEFAULT 250,
  extra_km_charge REAL DEFAULT 5,
  location VARCHAR(150) NOT NULL,
  pickup_hub_id VARCHAR(50) NOT NULL,
  latitude REAL,
  longitude REAL,
  description TEXT,
  features TEXT, -- JSON Array of strings
  badge VARCHAR(80),
  status VARCHAR(30) DEFAULT 'ACTIVE' CHECK(status IN ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'BOOKED', 'UNAVAILABLE', 'REJECTED', 'SUSPENDED')),
  verification_status VARCHAR(30) DEFAULT 'VERIFIED' CHECK(verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  rejection_reason TEXT,
  trips_completed INTEGER DEFAULT 0,
  rating REAL DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bikes_owner_id ON bikes(owner_id);
CREATE INDEX IF NOT EXISTS idx_bikes_category ON bikes(category);
CREATE INDEX IF NOT EXISTS idx_bikes_hub ON bikes(pickup_hub_id);
CREATE INDEX IF NOT EXISTS idx_bikes_status ON bikes(status, verification_status);

-- 3. BIKE PHOTOS TABLE (Strictly linked to bike_id, 5 mandatory views)
CREATE TABLE IF NOT EXISTS bike_photos (
  id VARCHAR(64) PRIMARY KEY,
  bike_id VARCHAR(64) NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(30) NOT NULL CHECK(photo_type IN ('FRONT', 'LEFT', 'RIGHT', 'REAR', 'ODOMETER', 'ADDITIONAL')),
  label VARCHAR(80) NOT NULL,
  is_primary INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  verification_status VARCHAR(30) DEFAULT 'VERIFIED' CHECK(verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bike_photos_bike_id ON bike_photos(bike_id);
CREATE INDEX IF NOT EXISTS idx_bike_photos_primary ON bike_photos(bike_id, is_primary);

-- 4. BOOKINGS TABLE (With strict server-side calculation and overlap protection)
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY, -- e.g. TORQO-CSN-88412
  bike_id VARCHAR(64) NOT NULL REFERENCES bikes(id),
  customer_id VARCHAR(64) NOT NULL REFERENCES users(id),
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_email VARCHAR(190) NOT NULL,
  customer_dl VARCHAR(50) NOT NULL,
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  handover_mode VARCHAR(30) DEFAULT 'hub',
  delivery_address TEXT,
  addons TEXT, -- JSON Object
  days INTEGER NOT NULL,
  base_amount REAL NOT NULL,
  addons_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  promo_code VARCHAR(30),
  gst_amount REAL NOT NULL,
  security_deposit REAL NOT NULL,
  platform_fee REAL NOT NULL, -- 12% marketplace take
  total_amount REAL NOT NULL,
  payment_method VARCHAR(30) DEFAULT 'upi',
  payment_status VARCHAR(30) DEFAULT 'PAID' CHECK(payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
  booking_status VARCHAR(30) DEFAULT 'CONFIRMED' CHECK(booking_status IN ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_bike_id ON bookings(bike_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(bike_id, start_datetime, end_datetime, booking_status);

-- 5. OWNER EARNINGS TABLE (Computed server-side: Gross - 12% commission = Net payout)
CREATE TABLE IF NOT EXISTS owner_earnings (
  id VARCHAR(64) PRIMARY KEY,
  owner_id VARCHAR(64) NOT NULL REFERENCES users(id),
  booking_id VARCHAR(64) NOT NULL REFERENCES bookings(id),
  gross_rental_amount REAL NOT NULL,
  platform_commission_amount REAL NOT NULL,
  net_owner_amount REAL NOT NULL,
  payout_status VARCHAR(30) DEFAULT 'PENDING' CHECK(payout_status IN ('PENDING', 'PAID')),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_owner_earnings_owner_id ON owner_earnings(owner_id);
CREATE INDEX IF NOT EXISTS idx_owner_earnings_booking_id ON owner_earnings(booking_id);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  bike_id VARCHAR(64) NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  customer_id VARCHAR(64) NOT NULL REFERENCES users(id),
  customer_name VARCHAR(120) NOT NULL,
  rating REAL NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_bike_id ON reviews(bike_id);
