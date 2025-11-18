-- Migration 007: Create User Progress Table

-- Create user progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    recognition_date TIMESTAMP, -- when user first recognized this word
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5), -- 0 = not learned, 5 = mastered
    review_count INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMP,
    next_review_date TIMESTAMP,
    is_learned BOOLEAN DEFAULT false,
    study_streak INTEGER DEFAULT 0, -- consecutive days of practice
    total_study_time INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word_id)
);

-- Create indexes for performance optimization
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_word ON user_progress(word_id);
CREATE INDEX idx_user_progress_mastery ON user_progress(mastery_level);
CREATE INDEX idx_user_progress_learned ON user_progress(is_learned);
CREATE INDEX idx_user_progress_review_date ON user_progress(next_review_date);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own progress
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to modify their own progress
CREATE POLICY "Users can modify their own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Create function to update study streak
CREATE OR REPLACE FUNCTION update_study_streak(user_uuid UUID, study_date DATE)
RETURNS INTEGER AS $$
DECLARE
    last_study_date DATE;
    current_streak INTEGER;
BEGIN
    -- Get the last study date for this user
    SELECT MAX(DATE(last_reviewed_at)) INTO last_study_date
    FROM user_progress
    WHERE user_id = user_uuid AND last_reviewed_at IS NOT NULL;

    -- Calculate current streak
    IF last_study_date IS NULL THEN
        -- First study session
        current_streak := 1;
    ELSIF last_study_date = study_date - INTERVAL '1 day' THEN
        -- Consecutive day
        SELECT study_streak + 1 INTO current_streak
        FROM user_progress
        WHERE user_id = user_uuid AND DATE(last_reviewed_at) = last_study_date
        LIMIT 1;
    ELSIF last_study_date < study_date THEN
        -- Missed a day, reset streak
        current_streak := 1;
    ELSE
        -- Same day, keep current streak
        SELECT study_streak INTO current_streak
        FROM user_progress
        WHERE user_id = user_uuid AND DATE(last_reviewed_at) = last_study_date
        LIMIT 1;
    END IF;

    RETURN current_streak;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate next review date using spaced repetition
CREATE OR REPLACE FUNCTION calculate_next_review(mastery_level INTEGER)
RETURNS DATE AS $$
BEGIN
    CASE mastery_level
        WHEN 0 THEN RETURN CURRENT_DATE + INTERVAL '0 days';    -- Review immediately
        WHEN 1 THEN RETURN CURRENT_DATE + INTERVAL '1 days';
        WHEN 2 THEN RETURN CURRENT_DATE + INTERVAL '3 days';
        WHEN 3 THEN RETURN CURRENT_DATE + INTERVAL '7 days';
        WHEN 4 THEN RETURN CURRENT_DATE + INTERVAL '14 days';
        WHEN 5 THEN RETURN CURRENT_DATE + INTERVAL '30 days';
        ELSE RETURN CURRENT_DATE + INTERVAL '1 days';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();