-- Migration: 20260101000000_init_schema.sql
-- Description: Core tables, enumerations, and extensions for DarDwa

-- 1. Enable Core Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. Enumerated Types
CREATE TYPE user_role AS ENUM ('user', 'verified_pharmacist', 'moderator', 'admin');
CREATE TYPE duty_type AS ENUM ('night', 'day', 'continuous_24h');
CREATE TYPE report_status AS ENUM ('available', 'out_of_stock');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');

-- 3. Profiles (tied to Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    full_name TEXT,
    pharmacy_id UUID,
    license_number TEXT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Laboratories
CREATE TABLE laboratories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    country TEXT DEFAULT 'Tunisie' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Active Ingredients (DCI - Dénomination Commune Internationale)
CREATE TABLE active_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    name_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Medicines Table
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    brand_name TEXT NOT NULL,
    brand_name_ar TEXT,
    dosage TEXT NOT NULL,
    dosage_mg NUMERIC(10, 2),
    form TEXT NOT NULL,
    form_category TEXT NOT NULL,
    presentation TEXT,
    laboratory_id UUID REFERENCES laboratories(id) ON DELETE SET NULL,
    public_price_tnd NUMERIC(10, 3) NOT NULL,
    is_generic BOOLEAN DEFAULT FALSE NOT NULL,
    cnam_covered BOOLEAN DEFAULT FALSE NOT NULL,
    cnam_reference_tariff NUMERIC(10, 3),
    last_updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 7. Medicine Ingredients Junction
CREATE TABLE medicine_ingredients (
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES active_ingredients(id) ON DELETE CASCADE,
    strength TEXT,
    PRIMARY KEY (medicine_id, ingredient_id)
);

-- 8. Pharmacies
CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ar TEXT,
    governorate TEXT NOT NULL,
    delegation TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT,
    phone TEXT,
    phone_emergency TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    opening_hours JSONB,
    is_night_shift_capable BOOLEAN DEFAULT FALSE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Duty Schedules
CREATE TABLE duty_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    duty_date DATE NOT NULL,
    duty_type duty_type NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Availability Reports
CREATE TABLE availability_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    status report_status NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_hash TEXT NOT NULL,
    moderation_status moderation_status DEFAULT 'approved' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours') NOT NULL
);

-- 11. Data Sources
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    source_url TEXT,
    records_count INTEGER DEFAULT 0,
    file_checksum TEXT,
    imported_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
