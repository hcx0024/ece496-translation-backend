-- Seed Data for Language Learning App
-- This file populates the database with initial data for development and testing

-- Insert supported languages
INSERT INTO languages (code, name, native_name) VALUES
('en', 'English', 'English'),
('es', 'Spanish', 'Español'),
('fr', 'French', 'Français'),
('de', 'German', 'Deutsch'),
('it', 'Italian', 'Italiano'),
('pt', 'Portuguese', 'Português'),
('zh', 'Chinese', '中文'),
('ja', 'Japanese', '日本語'),
('ko', 'Korean', '한국어'),
('ru', 'Russian', 'Русский'),
('ar', 'Arabic', 'العربية'),
('hi', 'Hindi', 'हिन्दी'),
('th', 'Thai', 'ไทย'),
('vi', 'Vietnamese', 'Tiếng Việt'),
('nl', 'Dutch', 'Nederlands');

-- Insert common object categories
INSERT INTO object_categories (category_name, description, icon_name) VALUES
('food', 'Edible items and food products', 'fork.knife'),
('animals', 'Living creatures and animals', 'hare'),
('clothing', 'Items worn on the body', 'tshirt'),
('furniture', 'Household furniture and fixtures', 'chair'),
('electronics', 'Electronic devices and gadgets', 'device.phone'),
('vehicles', 'Transportation vehicles', 'car'),
('plants', 'Plants, trees, and botanical items', 'leaf'),
('tools', 'Instruments and tools', 'wrench'),
('books', 'Books and written materials', 'book'),
('sports', 'Sports equipment and gear', 'basketball'),
('toys', 'Children toys and games', 'puzzlepiece.extension'),
('kitchen', 'Kitchen items and appliances', 'cooktop'),
('bathroom', 'Bathroom fixtures and items', 'shower'),
('office', 'Office supplies and equipment', 'laptopcomputer'),
('garden', 'Garden tools and plants', 'shovel');

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
    ('apple', 'food', 'noun', 1, true),
    ('banana', 'food', 'noun', 1, true),
    ('orange', 'food', 'noun', 1, true),
    ('bread', 'food', 'noun', 1, true),
    ('water', 'food', 'noun', 1, true),
    ('cat', 'animals', 'noun', 1, true),
    ('dog', 'animals', 'noun', 1, true),
    ('bird', 'animals', 'noun', 1, true),
    ('chair', 'furniture', 'noun', 1, true),
    ('table', 'furniture', 'noun', 1, true),
    ('bed', 'furniture', 'noun', 1, true),
    ('shirt', 'clothing', 'noun', 1, true),
    ('shoes', 'clothing', 'noun', 1, true),
    ('phone', 'electronics', 'noun', 1, true),
    ('computer', 'electronics', 'noun', 2, true),
    ('car', 'vehicles', 'noun', 1, true),
    ('tree', 'plants', 'noun', 1, true),
    ('flower', 'plants', 'noun', 1, true),
    ('book', 'books', 'noun', 1, true),
    ('pen', 'office', 'noun', 1, true)
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
    ('apple', 'manzana'),
    ('banana', 'plátano'),
    ('orange', 'naranja'),
    ('bread', 'pan'),
    ('water', 'agua'),
    ('cat', 'gato'),
    ('dog', 'perro'),
    ('bird', 'pájaro'),
    ('chair', 'silla'),
    ('table', 'mesa'),
    ('bed', 'cama'),
    ('shirt', 'camisa'),
    ('shoes', 'zapatos'),
    ('phone', 'teléfono'),
    ('computer', 'computadora')
) AS translation_data(english_word, spanish_translation)
JOIN words w ON w.word_text = translation_data.english_word AND w.language_code = 'en';

-- Insert French translations
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
    ('table', 'table')
) AS translation_data(english_word, french_translation)
JOIN words w ON w.word_text = translation_data.english_word AND w.language_code = 'en';

-- Insert some example sentences for common words
INSERT INTO example_sentences (word_id, sentence_text, language_code, sentence_translation, context_level, is_verified)
SELECT
    w.id,
    sentence_data.sentence,
    'en',
    sentence_data.translation,
    'basic',
    true
FROM (VALUES
    ('apple', 'I eat a red apple every day.', 'Yo como una manzana roja todos los días.'),
    ('cat', 'The cat is sleeping on the sofa.', 'El gato está durmiendo en el sofá.'),
    ('dog', 'My dog likes to play in the park.', 'A mi perro le gusta jugar en el parque.'),
    ('book', 'I am reading a interesting book.', 'Estoy leyendo un libro interesante.'),
    ('water', 'I need to drink water when I am thirsty.', 'Necesito beber agua cuando tengo sed.')
) AS sentence_data(word_text, sentence, translation)
JOIN words w ON w.word_text = sentence_data.word_text AND w.language_code = 'en';

-- Create a test user
INSERT INTO users (username, email, native_language_code, target_language_code, learning_preferences)
VALUES (
    'testuser',
    'test@example.com',
    'en',
    'es',
    '{"daily_goal": 10, "learning_style": "visual", "notifications": true}'
);

-- Create user progress for the test user with some initial words
INSERT INTO user_progress (user_id, word_id, recognition_date, mastery_level, review_count, is_learned)
SELECT
    u.id,
    w.id,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CASE
        WHEN w.word_text IN ('apple', 'cat', 'dog') THEN 3
        WHEN w.word_text IN ('book', 'water') THEN 2
        ELSE 1
    END,
    CASE
        WHEN w.word_text IN ('apple', 'cat', 'dog') THEN 5
        WHEN w.word_text IN ('book', 'water') THEN 3
        ELSE 1
    END,
    CASE
        WHEN w.word_text IN ('apple', 'cat', 'dog') THEN true
        ELSE false
    END
FROM users u
CROSS JOIN words w
WHERE u.username = 'testuser'
AND w.word_text IN ('apple', 'cat', 'dog', 'book', 'water', 'banana', 'chair', 'phone')
LIMIT 8;