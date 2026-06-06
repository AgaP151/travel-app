-- Demo seed data for local presentation

INSERT INTO categories (name, description) VALUES
('Góry', 'Aktywne wyjścia na szlaki i wspinaczka'),
('Morze', 'Wypoczynek na plaży i sporty wodne'),
('City Break', 'Krótkie wypady na zwiedzanie europejskich stolic'),
('Egzotyka', 'Dalsze podróże w strefy tropikalne'),
('Służbowe', 'Wyjazdy integracyjne i konferencje biznesowe')
ON CONFLICT (name) DO NOTHING;

UPDATE users
SET
    name = 'Admin Demo',
    role = 'ROLE_ADMIN'
WHERE email = 'admin@example.com';