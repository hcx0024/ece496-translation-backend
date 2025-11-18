-- Migration 004: Create Translations Table

-- Create translations table
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    target_language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
    translated_text VARCHAR(200) NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 1.0 CHECK (confidence_score BETWEEN 0.00 AND 1.00),
    is_verified BOOLEAN DEFAULT false,
    translation_type VARCHAR(20) DEFAULT 'direct', -- direct, contextual, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_word_id, target_language_code)
);

-- Create indexes for performance optimization
CREATE INDEX idx_translations_source ON translations(source_word_id);
CREATE INDEX idx_translations_target ON translations(target_language_code);
CREATE INDEX idx_translations_confidence ON translations(confidence_score);
CREATE INDEX idx_translations_verified ON translations(is_verified);

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON translations
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to modify
CREATE POLICY "Allow authenticated users to modify" ON translations
    FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();