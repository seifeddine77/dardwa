-- ============================================================================
-- DarDwa (دار الدواء) - Realistic Tunisian Seed Dataset
-- NOTE: Clearly marked as test/seed data for development and demonstration.
-- ============================================================================

-- 1. Laboratories
INSERT INTO laboratories (id, name, country) VALUES
('b1000000-0000-0000-0000-000000000001', 'UNIMED', 'Tunisie'),
('b1000000-0000-0000-0000-000000000002', 'SAIPH', 'Tunisie'),
('b1000000-0000-0000-0000-000000000003', 'TERIAK', 'Tunisie'),
('b1000000-0000-0000-0000-000000000004', 'ADWYA', 'Tunisie'),
('b1000000-0000-0000-0000-000000000005', 'MEDIS', 'Tunisie'),
('b1000000-0000-0000-0000-000000000006', 'OPALIA RECORDATI', 'Tunisie'),
('b1000000-0000-0000-0000-000000000007', 'SANOFI TUNISIE', 'France/Tunisie');

-- 2. Active Ingredients (DCI)
INSERT INTO active_ingredients (id, name, name_ar) VALUES
('c1000000-0000-0000-0000-000000000001', 'PARACETAMOL', 'باراسيتامول'),
('c1000000-0000-0000-0000-000000000002', 'AMOXICILLINE', 'أموكسيسيلين'),
('c1000000-0000-0000-0000-000000000003', 'IBUPROFENE', 'إيبوبروفين'),
('c1000000-0000-0000-0000-000000000004', 'PHLOROGLUCINOL', 'فلوروغلوسينول'),
('c1000000-0000-0000-0000-000000000005', 'OMEPRAZOLE', 'أوميبرازول');

-- 3. Medicines
INSERT INTO medicines (id, code, brand_name, brand_name_ar, dosage, dosage_mg, form, form_category, presentation, laboratory_id, public_price_tnd, is_generic, cnam_covered, cnam_reference_tariff) VALUES
-- Paracétamol 1000mg
('d1000000-0000-0000-0000-000000000001', 'PCT-001', 'DOLIPRANE 1000', 'دوليبران 1000', '1000 mg', 1000.00, 'Comprimé', 'tablet', 'Boîte de 8', 'b1000000-0000-0000-0000-000000000007', 4.850, FALSE, TRUE, 3.200),
('d1000000-0000-0000-0000-000000000002', 'PCT-002', 'PARALYOC 1000', 'باراليوك 1000', '1000 mg', 1000.00, 'Comprimé', 'tablet', 'Boîte de 8', 'b1000000-0000-0000-0000-000000000003', 3.100, TRUE, TRUE, 3.100),
('d1000000-0000-0000-0000-000000000003', 'PCT-003', 'ALGODOL 1000', 'الغولودول 1000', '1000 mg', 1000.00, 'Comprimé', 'tablet', 'Boîte de 8', 'b1000000-0000-0000-0000-000000000004', 2.750, TRUE, TRUE, 2.750),

-- Amoxicilline 1g
('d1000000-0000-0000-0000-000000000004', 'PCT-004', 'CLAMOXYL 1g', 'كلاموكسيل 1غ', '1 g', 1000.00, 'Comprimé dispersible', 'tablet', 'Boîte de 14', 'b1000000-0000-0000-0000-000000000007', 9.400, FALSE, TRUE, 6.500),
('d1000000-0000-0000-0000-000000000005', 'PCT-005', 'AMOXIL 1g', 'أموكسيل 1غ', '1 g', 1000.00, 'Comprimé dispersible', 'tablet', 'Boîte de 14', 'b1000000-0000-0000-0000-000000000005', 6.200, TRUE, TRUE, 6.200),
('d1000000-0000-0000-0000-000000000006', 'PCT-006', 'AMOXIPEN 1g', 'أموكسيبان 1غ', '1 g', 1000.00, 'Comprimé dispersible', 'tablet', 'Boîte de 14', 'b1000000-0000-0000-0000-000000000002', 5.800, TRUE, TRUE, 5.800),

-- Phloroglucinol (Spasfon)
('d1000000-0000-0000-0000-000000000007', 'PCT-007', 'SPASFON 80mg', 'سباسفون 80 مغ', '80 mg', 80.00, 'Comprimé', 'tablet', 'Boîte de 30', 'b1000000-0000-0000-0000-000000000007', 5.150, FALSE, TRUE, 3.500),
('d1000000-0000-0000-0000-000000000008', 'PCT-008', 'SPASMOREST 80mg', 'سباسموريست 80 مغ', '80 mg', 80.00, 'Comprimé', 'tablet', 'Boîte de 30', 'b1000000-0000-0000-0000-000000000004', 3.400, TRUE, TRUE, 3.400),

-- Ibuprofène 400mg
('d1000000-0000-0000-0000-000000000009', 'PCT-009', 'ADVIL 400mg', 'أدفيل 400 مغ', '400 mg', 400.00, 'Comprimé enrobé', 'tablet', 'Boîte de 20', 'b1000000-0000-0000-0000-000000000007', 6.300, FALSE, FALSE, NULL),
('d1000000-0000-0000-0000-000000000010', 'PCT-010', 'IBUDEX 400mg', 'إيبوديكس 400 مغ', '400 mg', 400.00, 'Comprimé enrobé', 'tablet', 'Boîte de 20', 'b1000000-0000-0000-0000-000000000001', 3.800, TRUE, FALSE, NULL),

-- Oméprazole 20mg
('d1000000-0000-0000-0000-000000000011', 'PCT-011', 'MOPRAL 20mg', 'موبرال 20 مغ', '20 mg', 20.00, 'Gélule gastro-résistante', 'capsule', 'Boîte de 14', 'b1000000-0000-0000-0000-000000000007', 14.200, FALSE, TRUE, 9.800),
('d1000000-0000-0000-0000-000000000012', 'PCT-012', 'OPRAZOL 20mg', 'أوبرازول 20 مغ', '20 mg', 20.00, 'Gélule gastro-résistante', 'capsule', 'Boîte de 14', 'b1000000-0000-0000-0000-000000000006', 8.900, TRUE, TRUE, 8.900);

-- 4. Medicine - Ingredient Relations
INSERT INTO medicine_ingredients (medicine_id, ingredient_id, strength) VALUES
('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', '1000 mg'),
('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', '1000 mg'),
('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', '1000 mg'),
('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', '1000 mg'),
('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', '1000 mg'),
('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', '1000 mg'),
('d1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000004', '80 mg'),
('d1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000004', '80 mg'),
('d1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003', '400 mg'),
('d1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000003', '400 mg'),
('d1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000005', '20 mg'),
('d1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000005', '20 mg');

-- 5. Pharmacies in Tunisia (Grand Tunis, Sousse, Sfax)
INSERT INTO pharmacies (id, name, name_ar, governorate, delegation, address, postal_code, phone, phone_emergency, location, is_night_shift_capable, is_verified) VALUES
('e1000000-0000-0000-0000-000000000001', 'Pharmacie Centrale de Tunis', 'صيدلية تونس المركزية', 'Tunis', 'Bab El Bhar', 'Avenue Habib Bourguiba, Tunis', '1000', '+216 71 245 100', '+216 71 245 101', ST_SetSRID(ST_MakePoint(10.1815, 36.8002), 4326), TRUE, TRUE),
('e1000000-0000-0000-0000-000000000002', 'Pharmacie de Nuit Ennasr', 'صيدلية النصر الليلية', 'Ariana', 'Ariana Ville', 'Avenue Hédi Nouira, Ennasr 2', '2037', '+216 71 829 330', '+216 71 829 331', ST_SetSRID(ST_MakePoint(10.1582, 36.8571), 4326), TRUE, TRUE),
('e1000000-0000-0000-0000-000000000003', 'Pharmacie El Manar', 'صيدلية المنار', 'Tunis', 'El Menzah', 'Centre Commercial El Manar 2', '2092', '+216 71 884 120', NULL, ST_SetSRID(ST_MakePoint(10.1465, 36.8378), 4326), FALSE, TRUE),
('e1000000-0000-0000-0000-000000000004', 'Pharmacie de Garde Sousse', 'صيدلية استمرار سوسة', 'Sousse', 'Sousse Ville', 'Boulevard 14 Janvier, Sousse', '4000', '+216 73 227 400', '+216 73 227 401', ST_SetSRID(ST_MakePoint(10.6369, 35.8256), 4326), TRUE, TRUE),
('e1000000-0000-0000-0000-000000000005', 'Pharmacie de Nuit Sfax', 'صيدلية استمرار صفاقس', 'Sfax', 'Sfax Ville', 'Route de Téniour Km 1.5, Sfax', '3000', '+216 74 401 220', '+216 74 401 221', ST_SetSRID(ST_MakePoint(10.7602, 34.7405), 4326), TRUE, TRUE);

-- 6. Duty Schedules (Current and Next days)
INSERT INTO duty_schedules (id, pharmacy_id, duty_date, duty_type, start_time, end_time, notes) VALUES
('f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', CURRENT_DATE, 'night', CURRENT_DATE + TIME '20:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00', 'Garde de nuit 20h -> 08h'),
('f1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000002', CURRENT_DATE, 'continuous_24h', CURRENT_DATE + TIME '08:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00', 'Ouvert 24h/24'),
('f1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000004', CURRENT_DATE, 'night', CURRENT_DATE + TIME '20:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00', 'Garde de nuit Sousse'),
('f1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000005', CURRENT_DATE, 'night', CURRENT_DATE + TIME '20:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00', 'Garde de nuit Sfax');
