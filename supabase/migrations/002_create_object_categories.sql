-- Migration 002: Create Object Categories Table

-- Create object categories table
CREATE TABLE object_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50), -- For frontend display (SF Symbol names)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster category name lookups
CREATE INDEX idx_object_categories_name ON object_categories(category_name);

-- Enable Row Level Security
ALTER TABLE object_categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON object_categories
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to modify
CREATE POLICY "Allow authenticated users to modify" ON object_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert common object categories with SF Symbol icon names
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
('garden', 'Garden tools and plants', 'shovel'),
('weather', 'Weather-related objects and phenomena', 'cloud.sun'),
('body', 'Body parts and human anatomy', 'person'),
('household', 'General household items', 'house'),
('nature', 'Natural elements and landscapes', 'mountain'),
('music', 'Musical instruments and audio equipment', 'music.note');