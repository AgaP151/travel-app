-- Demo users for local presentation
-- Login:
-- admin@example.com / Admin123!
-- demo users / Demo123!

UPDATE users
SET
    name = 'Admin Demo',
    password_hash = '$2y$10$2Qs7zKDg2fTgila9bpdRce..iVJvJj2tqWaMZOPN3LtuC0zmPKip6',
    role = 'ROLE_ADMIN'
WHERE email = 'admin@example.com';

INSERT INTO users (name, email, password_hash, role) VALUES
('Jan Kowalski', 'jan.kowalski@example.com', '$2y$10$RxMr2E1XXe2aZXu70OHsiOpWmi0VUXveVQQXc3k9qonXPti.4CMZ2', 'ROLE_USER'),
('Anna Nowak', 'anna.nowak@example.com', '$2y$10$RxMr2E1XXe2aZXu70OHsiOpWmi0VUXveVQQXc3k9qonXPti.4CMZ2', 'ROLE_USER'),
('Piotr Wiśniewski', 'piotr.w@example.com', '$2y$10$RxMr2E1XXe2aZXu70OHsiOpWmi0VUXveVQQXc3k9qonXPti.4CMZ2', 'ROLE_USER'),
('Katarzyna Wójcik', 'kasia.w@example.com', '$2y$10$RxMr2E1XXe2aZXu70OHsiOpWmi0VUXveVQQXc3k9qonXPti.4CMZ2', 'ROLE_USER'),
('Michał Kowalczyk', 'michal.k@example.com', '$2y$10$RxMr2E1XXe2aZXu70OHsiOpWmi0VUXveVQQXc3k9qonXPti.4CMZ2', 'ROLE_USER'),
('Agnieszka Kamińska', 'aga.k@example.com', '$2y$10$RxMr2E1XXe2aZXu70OHsiOpWmi0VUXveVQQXc3k9qonXPti.4CMZ2', 'ROLE_USER')
ON CONFLICT (email) DO NOTHING;
