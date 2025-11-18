-- Migration 001: Create Languages Table
-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create languages table
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL, -- 'en', 'es', 'zh', 'fr', etc.
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster language code lookups
CREATE INDEX idx_languages_code ON languages(code);

-- Enable Row Level Security
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON languages
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to modify
CREATE POLICY "Allow authenticated users to modify" ON languages
    FOR ALL USING (auth.role() = 'authenticated');

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