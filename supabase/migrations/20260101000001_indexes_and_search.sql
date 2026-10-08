-- Migration: 20260101000001_indexes_and_search.sql
-- Description: Spatial indexes, Trigram fuzzy indexes, and search RPC functions

-- 1. Spatial Index for Pharmacies
CREATE INDEX IF NOT EXISTS idx_pharmacies_location ON pharmacies USING GIST(location);

-- 2. Trigram Indexes for Typo/Accent-Tolerant Search
CREATE INDEX IF NOT EXISTS idx_medicines_brand_name_trgm ON medicines USING GIN (brand_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_medicines_brand_name_ar_trgm ON medicines USING GIN (brand_name_ar gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_active_ingredients_name_trgm ON active_ingredients USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_active_ingredients_name_ar_trgm ON active_ingredients USING GIN (name_ar gin_trgm_ops);

-- 3. Composite Indexes for Fast Lookups
CREATE INDEX IF NOT EXISTS idx_duty_date_pharmacy ON duty_schedules (duty_date, pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_reports_lookup ON availability_reports (medicine_id, pharmacy_id, expires_at)
WHERE moderation_status = 'approved';

-- 4. Fuzzy & Typo-Tolerant Search RPC Function
CREATE OR REPLACE FUNCTION search_medicines(query_text TEXT, match_limit INT DEFAULT 20)
RETURNS TABLE (
    id UUID,
    code TEXT,
    brand_name TEXT,
    brand_name_ar TEXT,
    dosage TEXT,
    dosage_mg NUMERIC,
    form TEXT,
    form_category TEXT,
    presentation TEXT,
    public_price_tnd NUMERIC,
    is_generic BOOLEAN,
    cnam_covered BOOLEAN,
    cnam_reference_tariff NUMERIC,
    similarity REAL
) LANGUAGE sql STABLE AS $$
    SELECT 
        m.id,
        m.code,
        m.brand_name,
        m.brand_name_ar,
        m.dosage,
        m.dosage_mg,
        m.form,
        m.form_category,
        m.presentation,
        m.public_price_tnd,
        m.is_generic,
        m.cnam_covered,
        m.cnam_reference_tariff,
        GREATEST(
            similarity(unaccent(m.brand_name), unaccent(query_text)),
            similarity(COALESCE(m.brand_name_ar, ''), query_text),
            COALESCE((
                SELECT MAX(similarity(unaccent(ai.name), unaccent(query_text)))
                FROM medicine_ingredients mi
                JOIN active_ingredients ai ON ai.id = mi.ingredient_id
                WHERE mi.medicine_id = m.id
            ), 0.0)
        ) AS similarity
    FROM medicines m
    WHERE 
        m.is_active = TRUE
        AND (
            unaccent(m.brand_name) % unaccent(query_text)
            OR (m.brand_name_ar IS NOT NULL AND m.brand_name_ar % query_text)
            OR unaccent(m.brand_name) ILIKE '%' || unaccent(query_text) || '%'
            OR (m.brand_name_ar IS NOT NULL AND m.brand_name_ar ILIKE '%' || query_text || '%')
            OR EXISTS (
                SELECT 1 FROM medicine_ingredients mi
                JOIN active_ingredients ai ON ai.id = mi.ingredient_id
                WHERE mi.medicine_id = m.id
                AND (
                    unaccent(ai.name) % unaccent(query_text)
                    OR (ai.name_ar IS NOT NULL AND ai.name_ar % query_text)
                    OR unaccent(ai.name) ILIKE '%' || unaccent(query_text) || '%'
                )
            )
        )
    ORDER BY similarity DESC, m.public_price_tnd ASC
    LIMIT match_limit;
$$;

-- 5. Generic Equivalents Finder RPC Function
CREATE OR REPLACE FUNCTION get_generic_equivalents(target_medicine_id UUID)
RETURNS TABLE (
    id UUID,
    brand_name TEXT,
    brand_name_ar TEXT,
    dosage TEXT,
    form TEXT,
    public_price_tnd NUMERIC,
    price_difference_tnd NUMERIC,
    percentage_savings NUMERIC,
    is_generic BOOLEAN,
    cnam_covered BOOLEAN
) LANGUAGE sql STABLE AS $$
    WITH target AS (
        SELECT id, dosage_mg, form_category, public_price_tnd
        FROM medicines WHERE id = target_medicine_id
    ),
    target_dcis AS (
        SELECT ARRAY_AGG(ingredient_id ORDER BY ingredient_id) AS dci_list
        FROM medicine_ingredients WHERE medicine_id = target_medicine_id
    )
    SELECT 
        m.id,
        m.brand_name,
        m.brand_name_ar,
        m.dosage,
        m.form,
        m.public_price_tnd,
        (t.public_price_tnd - m.public_price_tnd) AS price_difference_tnd,
        ROUND(((t.public_price_tnd - m.public_price_tnd) / t.public_price_tnd) * 100, 1) AS percentage_savings,
        m.is_generic,
        m.cnam_covered
    FROM medicines m
    CROSS JOIN target t
    CROSS JOIN target_dcis td
    WHERE 
        m.id != target_medicine_id
        AND m.is_active = TRUE
        AND m.dosage_mg = t.dosage_mg
        AND m.form_category = t.form_category
        AND (
            SELECT ARRAY_AGG(mi.ingredient_id ORDER BY mi.ingredient_id)
            FROM medicine_ingredients mi WHERE mi.medicine_id = m.id
        ) = td.dci_list
    ORDER BY m.public_price_tnd ASC;
$$;

-- 6. Nearby Pharmacies PostGIS Query
CREATE OR REPLACE FUNCTION get_nearby_pharmacies(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 5000
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    name_ar TEXT,
    governorate TEXT,
    delegation TEXT,
    address TEXT,
    phone TEXT,
    distance_meters DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
) LANGUAGE sql STABLE AS $$
    SELECT
        p.id,
        p.name,
        p.name_ar,
        p.governorate,
        p.delegation,
        p.address,
        p.phone,
        ST_Distance(
            p.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
        ) AS distance_meters,
        ST_Y(p.location::geometry) AS latitude,
        ST_X(p.location::geometry) AS longitude
    FROM pharmacies p
    WHERE ST_DWithin(
        p.location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
        radius_meters
    )
    ORDER BY distance_meters ASC;
$$;
