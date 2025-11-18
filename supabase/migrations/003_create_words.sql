-- Migration 003: Create Words Table

-- Create words table
CREATE TABLE words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word_text VARCHAR(200) NOT NULL,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
    category_id UUID REFERENCES object_categories(id),
    part_of_speech VARCHAR(50), -- noun, verb, adjective, etc.
    phonetic_transcription VARCHAR(200),
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    is_common BOOLEAN DEFAULT false,
    frequency_score DECIMAL(8,3) DEFAULT 0.000, -- Word frequency in corpus
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(word_text, language_code)
);

-- Create indexes for performance optimization
CREATE INDEX idx_words_language ON words(language_code);
CREATE INDEX idx_words_category ON words(category_id);
CREATE INDEX idx_words_text ON words USING gin(to_tsvector('english', word_text));
CREATE INDEX idx_words_common ON words(is_common) WHERE is_common = true;
CREATE INDEX idx_words_difficulty ON words(difficulty_level);

-- Enable Row Level Security
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON words
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to modify
CREATE POLICY "Allow authenticated users to modify" ON words
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_words_updated_at
    BEFORE UPDATE ON words
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();