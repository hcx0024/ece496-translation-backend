t-- Migration 001: Create Languages and Object Categories
-- This migration creates the foundational tables for languages and object categories

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Languages table - supported languages for translations
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL, -- 'en', 'es', 'zh', 'fr', etc.
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Object categories - categories of objects that can be recognized
CREATE TABLE object_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50), -- For frontend display
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_languages_code ON languages(code);

-- Insert initial language data
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
('ru', 'Russian', 'Русский');

-- Insert initial object categories
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
('kitchen', 'Kitchen items and appliances', 'cooktop'),
('bathroom', 'Bathroom fixtures and items', 'shower'),
('office', 'Office supplies and equipment', 'laptopcomputer');