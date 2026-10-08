-- Migration: 20260101000002_rls_policies.sql
-- Description: Strict Row Level Security policies for all tables

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE duty_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users read own profile, admins read all" ON profiles
    FOR SELECT USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Public Read Catalog
CREATE POLICY "Public read medicines" ON medicines
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read active_ingredients" ON active_ingredients
    FOR SELECT USING (TRUE);

CREATE POLICY "Public read laboratories" ON laboratories
    FOR SELECT USING (TRUE);

CREATE POLICY "Public read medicine_ingredients" ON medicine_ingredients
    FOR SELECT USING (TRUE);

CREATE POLICY "Public read pharmacies" ON pharmacies
    FOR SELECT USING (TRUE);

CREATE POLICY "Public read duty schedules" ON duty_schedules
    FOR SELECT USING (TRUE);

CREATE POLICY "Public read data_sources" ON data_sources
    FOR SELECT USING (TRUE);

-- 3. Availability Reports
CREATE POLICY "Public read approved active reports" ON availability_reports
    FOR SELECT USING (expires_at > NOW() AND moderation_status = 'approved');

CREATE POLICY "Authenticated users submit report" ON availability_reports
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Verified Pharmacists
CREATE POLICY "Pharmacists update own pharmacy" ON pharmacies
    FOR UPDATE USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
        OR id = (SELECT pharmacy_id FROM profiles WHERE id = auth.uid() AND is_verified = TRUE)
    );

-- 5. Admin Full Management
CREATE POLICY "Admins manage medicines" ON medicines
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins manage duty schedules" ON duty_schedules
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins manage availability reports" ON availability_reports
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
