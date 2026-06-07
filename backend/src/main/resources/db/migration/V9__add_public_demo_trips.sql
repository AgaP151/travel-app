-- Mark selected demo trips as public inspirations visible to all users

ALTER TABLE trips
ADD COLUMN is_public_demo BOOLEAN DEFAULT FALSE NOT NULL;

UPDATE trips
SET is_public_demo = TRUE
WHERE title IN (
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
);
