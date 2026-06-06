-- Demo trips for local presentation

INSERT INTO trips (category_id, title, destination, start_date, end_date, description, price, is_archived) VALUES
((SELECT id FROM categories WHERE name = 'Góry'), 'Weekend w Tatrach', 'Zakopane, Polska', '2026-07-10', '2026-07-12', 'Krótki wyjazd w góry z checklistą i pogodą.', 450.00, false),
((SELECT id FROM categories WHERE name = 'Góry'), 'Zdobycie Śnieżki', 'Karpacz, Polska', '2026-08-05', '2026-08-07', 'Aktywny weekend i wejście na Śnieżkę.', 300.00, false),
((SELECT id FROM categories WHERE name = 'Morze'), 'Relaks na Helu', 'Hel, Polska', '2026-07-01', '2026-07-10', 'Letni wypoczynek nad Bałtykiem.', 1200.00, false),
((SELECT id FROM categories WHERE name = 'Morze'), 'Słoneczna Majorka', 'Palma, Hiszpania', '2026-08-10', '2026-08-17', 'Wakacje z pogodą, walutą i planem atrakcji.', 1800.00, false),
((SELECT id FROM categories WHERE name = 'City Break'), 'Klimatyczna Praga', 'Praga, Czechy', '2026-09-18', '2026-09-20', 'Krótki city break z mostem Karola i starym miastem.', 500.00, false),
((SELECT id FROM categories WHERE name = 'City Break'), 'Magiczny Paryż', 'Paryż, Francja', '2026-11-05', '2026-11-08', 'Weekend w Paryżu z najważniejszymi atrakcjami.', 1100.00, false),
((SELECT id FROM categories WHERE name = 'City Break'), 'Zwiedzanie Rzymu', 'Rzym, Włochy', '2026-10-10', '2026-10-13', 'Zwiedzanie Rzymu i Koloseum.', 900.00, false),
((SELECT id FROM categories WHERE name = 'Egzotyka'), 'Tajemnice Bali', 'Bali, Indonezja', '2026-12-01', '2026-12-14', 'Dalsza podróż demo z większym budżetem.', 5500.00, false),
((SELECT id FROM categories WHERE name = 'Egzotyka'), 'Safari w Kenii', 'Nairobi, Kenia', '2027-01-10', '2027-01-20', 'Egzotyczna wyprawa i plan atrakcji.', 6200.00, false),
((SELECT id FROM categories WHERE name = 'Służbowe'), 'Targi IT w Monachium', 'Monachium, Niemcy', '2026-09-05', '2026-09-07', 'Przykładowy wyjazd służbowy.', 0.00, false);

INSERT INTO trip_user (trip_id, user_id)
SELECT t.id, u.id
FROM trips t
JOIN users u ON u.email = 'jan.kowalski@example.com'
WHERE t.title IN (
    'Weekend w Tatrach',
    'Zdobycie Śnieżki',
    'Relaks na Helu',
    'Słoneczna Majorka',
    'Klimatyczna Praga',
    'Magiczny Paryż',
    'Zwiedzanie Rzymu',
    'Tajemnice Bali',
    'Safari w Kenii',
    'Targi IT w Monachium'
)
ON CONFLICT DO NOTHING;

INSERT INTO trip_user (trip_id, user_id)
SELECT t.id, u.id
FROM trips t
JOIN users u ON u.email = 'anna.nowak@example.com'
WHERE t.title IN (
    'Klimatyczna Praga',
    'Magiczny Paryż',
    'Słoneczna Majorka'
)
ON CONFLICT DO NOTHING;
