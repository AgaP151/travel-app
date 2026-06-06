-- Demo tasks/checklists for local presentation

INSERT INTO tasks (trip_id, title, is_completed)
SELECT t.id, task.title, task.is_completed
FROM trips t
JOIN (
    VALUES
    ('Weekend w Tatrach', 'Spakować buty trekkingowe', true),
    ('Weekend w Tatrach', 'Sprawdzić prognozę pogody', true),
    ('Weekend w Tatrach', 'Kupić bilety na pociąg', false),
    ('Weekend w Tatrach', 'Zarezerwować nocleg', false),

    ('Klimatyczna Praga', 'Sprawdzić kurs CZK', true),
    ('Klimatyczna Praga', 'Dodać Most Karola do planu', true),
    ('Klimatyczna Praga', 'Kupić bilety autobusowe', false),
    ('Klimatyczna Praga', 'Przygotować dokumenty', false),

    ('Magiczny Paryż', 'Sprawdzić pogodę na weekend', true),
    ('Magiczny Paryż', 'Zarezerwować wejście na wieżę Eiffla', false),
    ('Magiczny Paryż', 'Przygotować budżet w EUR', false),

    ('Słoneczna Majorka', 'Sprawdzić loty', true),
    ('Słoneczna Majorka', 'Spakować krem z filtrem', false),
    ('Słoneczna Majorka', 'Zaplanować atrakcje', false),

    ('Targi IT w Monachium', 'Przygotować identyfikator', true),
    ('Targi IT w Monachium', 'Sprawdzić adres wydarzenia', false),
    ('Targi IT w Monachium', 'Zabrać laptopa i ładowarkę', false)
) AS task(trip_title, title, is_completed)
ON task.trip_title = t.title;
