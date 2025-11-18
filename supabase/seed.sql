-- Seed Data for Language Learning App
-- This file populates the database with initial data for development and testing

-- Insert some basic vocabulary words (English)
INSERT INTO words (word_text, language_code, category_id, part_of_speech, difficulty_level, is_common)
SELECT
    word_data.word_text,
    'en',
    oc.id,
    word_data.part_of_speech,
    word_data.difficulty_level,
    word_data.is_common
FROM (VALUES
    -- Food items
    ('apple', 'food', 'noun', 1, true),
    ('banana', 'food', 'noun', 1, true),
    ('orange', 'food', 'noun', 1, true),
    ('bread', 'food', 'noun', 1, true),
    ('water', 'food', 'noun', 1, true),
    ('milk', 'food', 'noun', 1, true),
    ('cheese', 'food', 'noun', 2, true),
    ('coffee', 'food', 'noun', 2, true),
    ('tea', 'food', 'noun', 2, true),
    ('pizza', 'food', 'noun', 2, true),

    -- Animals
    ('cat', 'animals', 'noun', 1, true),
    ('dog', 'animals', 'noun', 1, true),
    ('bird', 'animals', 'noun', 1, true),
    ('fish', 'animals', 'noun', 1, true),
    ('horse', 'animals', 'noun', 2, true),
    ('elephant', 'animals', 'noun', 2, false),
    ('lion', 'animals', 'noun', 2, false),
    ('tiger', 'animals', 'noun', 2, false),
    ('bear', 'animals', 'noun', 2, false),
    ('rabbit', 'animals', 'noun', 2, true),

    -- Furniture
    ('chair', 'furniture', 'noun', 1, true),
    ('table', 'furniture', 'noun', 1, true),
    ('bed', 'furniture', 'noun', 1, true),
    ('sofa', 'furniture', 'noun', 2, true),
    ('desk', 'furniture', 'noun', 2, true),
    ('door', 'furniture', 'noun', 1, true),
    ('window', 'furniture', 'noun', 1, true),
    ('lamp', 'furniture', 'noun', 2, true),
    ('mirror', 'furniture', 'noun', 2, true),
    ('shelf', 'furniture', 'noun', 2, true),

    -- Clothing
    ('shirt', 'clothing', 'noun', 1, true),
    ('shoes', 'clothing', 'noun', 1, true),
    ('hat', 'clothing', 'noun', 1, true),
    ('pants', 'clothing', 'noun', 1, true),
    ('dress', 'clothing', 'noun', 2, true),
    ('jacket', 'clothing', 'noun', 2, true),
    ('socks', 'clothing', 'noun', 1, true),
    ('belt', 'clothing', 'noun', 2, true),
    ('gloves', 'clothing', 'noun', 2, true),
    ('scarf', 'clothing', 'noun', 2, true),

    -- Electronics
    ('phone', 'electronics', 'noun', 1, true),
    ('computer', 'electronics', 'noun', 2, true),
    ('television', 'electronics', 'noun', 2, true),
    ('radio', 'electronics', 'noun', 2, true),
    ('camera', 'electronics', 'noun', 2, true),
    ('keyboard', 'electronics', 'noun', 2, true),
    ('mouse', 'electronics', 'noun', 2, true),
    ('headphones', 'electronics', 'noun', 2, true),
    ('battery', 'electronics', 'noun', 2, true),
    ('charger', 'electronics', 'noun', 2, true),

    -- Vehicles
    ('car', 'vehicles', 'noun', 1, true),
    ('bus', 'vehicles', 'noun', 1, true),
    ('train', 'vehicles', 'noun', 1, true),
    ('bicycle', 'vehicles', 'noun', 2, true),
    ('airplane', 'vehicles', 'noun', 2, true),
    ('ship', 'vehicles', 'noun', 2, true),
    ('motorcycle', 'vehicles', 'noun', 2, false),
    ('boat', 'vehicles', 'noun', 2, true),
    ('truck', 'vehicles', 'noun', 2, true),
    ('taxi', 'vehicles', 'noun', 2, true),

    -- Plants
    ('tree', 'plants', 'noun', 1, true),
    ('flower', 'plants', 'noun', 1, true),
    ('grass', 'plants', 'noun', 1, true),
    ('leaf', 'plants', 'noun', 1, true),
    ('rose', 'plants', 'noun', 2, true),
    ('sunflower', 'plants', 'noun', 2, false),
    ('cactus', 'plants', 'noun', 2, false),
    ('bush', 'plants', 'noun', 2, true),
    ('garden', 'plants', 'noun', 2, true),
    ('forest', 'plants', 'noun', 2, true),

    -- Books
    ('book', 'books', 'noun', 1, true),
    ('pen', 'books', 'noun', 1, true),
    ('pencil', 'books', 'noun', 1, true),
    ('paper', 'books', 'noun', 1, true),
    ('notebook', 'books', 'noun', 2, true),
    ('magazine', 'books', 'noun', 2, true),
    ('newspaper', 'books', 'noun', 2, true),
    ('dictionary', 'books', 'noun', 2, false),
    ('library', 'books', 'noun', 2, true),
    ('school', 'books', 'noun', 1, true)
) AS word_data(word_text, category_name, part_of_speech, difficulty_level, is_common)
JOIN object_categories oc ON oc.category_name = word_data.category_name;

-- Insert translations for some basic words (Spanish)
INSERT INTO translations (source_word_id, target_language_code, translated_text, confidence_score, is_verified)
SELECT
    w.id,
    'es',
    translation_data.spanish_translation,
    1.0,
    true
FROM (VALUES
    -- Food
    ('apple', 'manzana'),
    ('banana', 'plátano'),
    ('orange', 'naranja'),
    ('bread', 'pan'),
    ('water', 'agua'),
    ('milk', 'leche'),
    ('cheese', 'queso'),
    ('coffee', 'café'),
    ('tea', 'té'),
    ('pizza', 'pizza'),

    -- Animals
    ('cat', 'gato'),
    ('dog', 'perro'),
    ('bird', 'pájaro'),
    ('fish', 'pez'),
    ('horse', 'caballo'),
    ('elephant', 'elefante'),
    ('lion', 'león'),
    ('tiger', 'tigre'),
    ('bear', 'oso'),
    ('rabbit', 'conejo'),

    -- Furniture
    ('chair', 'silla'),
    ('table', 'mesa'),
    ('bed', 'cama'),
    ('sofa', 'sofá'),
    ('desk', 'escritorio'),
    ('door', 'puerta'),
    ('window', 'ventana'),
    ('lamp', 'lámpara'),
    ('mirror', 'espejo'),
    ('shelf', 'estante'),

    -- Clothing
    ('shirt', 'camisa'),
    ('shoes', 'zapatos'),
    ('hat', 'sombrero'),
    ('pants', 'pantalones'),
    ('dress', 'vestido'),
    ('jacket', 'chaqueta'),
    ('socks', 'calcetines'),
    ('belt', 'cinturón'),
    ('gloves', 'guantes'),
    ('scarf', 'bufanda'),

    -- Electronics
    ('phone', 'teléfono'),
    ('computer', 'computadora'),
    ('television', 'televisión'),
    ('radio', 'radio'),
    ('camera', 'cámara'),
    ('keyboard', 'teclado'),
    ('mouse', 'ratón'),
    ('headphones', 'auriculares'),
    ('battery', 'batería'),
    ('charger', 'cargador'),

    -- Vehicles
    ('car', 'coche'),
    ('bus', 'autobús'),
    ('train', 'tren'),
    ('bicycle', 'bicicleta'),
    ('airplane', 'avión'),
    ('ship', 'barco'),
    ('motorcycle', 'motocicleta'),
    ('boat', 'barco'),
    ('truck', 'camión'),
    ('taxi', 'taxi'),

    -- Plants
    ('tree', 'árbol'),
    ('flower', 'flor'),
    ('grass', 'césped'),
    ('leaf', 'hoja'),
    ('rose', 'rosa'),
    ('sunflower', 'girasol'),
    ('cactus', 'cactus'),
    ('bush', 'arbusto'),
    ('garden', 'jardín'),
    ('forest', 'bosque'),

    -- Books
    ('book', 'libro'),
    ('pen', 'pluma'),
    ('pencil', 'lápiz'),
    ('paper', 'papel'),
    ('notebook', 'cuaderno'),
    ('magazine', 'revista'),
    ('newspaper', 'periódico'),
    ('dictionary', 'diccionario'),
    ('library', 'biblioteca'),
    ('school', 'escuela')
) AS translation_data(english_word, spanish_translation)
JOIN words w ON w.word_text = translation_data.english_word AND w.language_code = 'en';

-- Insert French translations for common words
INSERT INTO translations (source_word_id, target_language_code, translated_text, confidence_score, is_verified)
SELECT
    w.id,
    'fr',
    translation_data.french_translation,
    1.0,
    true
FROM (VALUES
    ('apple', 'pomme'),
    ('banana', 'banane'),
    ('orange', 'orange'),
    ('bread', 'pain'),
    ('water', 'eau'),
    ('cat', 'chat'),
    ('dog', 'chien'),
    ('bird', 'oiseau'),
    ('chair', 'chaise'),
    ('table', 'table'),
    ('bed', 'lit'),
    ('shirt', 'chemise'),
    ('shoes', 'chaussures'),
    ('phone', 'téléphone'),
    ('computer', 'ordinateur'),
    ('car', 'voiture'),
    ('tree', 'arbre'),
    ('flower', 'fleur'),
    ('book', 'livre'),
    ('pen', 'stylo')
) AS translation_data(english_word, french_translation)
JOIN words w ON w.word_text = translation_data.english_word AND w.language_code = 'en';

-- Insert German translations for basic words
INSERT INTO translations (source_word_id, target_language_code, translated_text, confidence_score, is_verified)
SELECT
    w.id,
    'de',
    translation_data.german_translation,
    1.0,
    true
FROM (VALUES
    ('apple', 'Apfel'),
    ('banana', 'Banane'),
    ('water', 'Wasser'),
    ('cat', 'Katze'),
    ('dog', 'Hund'),
    ('chair', 'Stuhl'),
    ('table', 'Tisch'),
    ('book', 'Buch'),
    ('pen', 'Stift'),
    ('house', 'Haus')
) AS translation_data(english_word, german_translation)
JOIN words w ON w.word_text = translation_data.english_word AND w.language_code = 'en';