-- AgroLabs Database Schema (Simplified for Testing)
-- Run this in your Supabase SQL Editor

-- Create farmer_profiles table
CREATE TABLE IF NOT EXISTS farmer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farms table
CREATE TABLE IF NOT EXISTS farms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  location JSONB NOT NULL,
  crop_type TEXT,
  irrigation_type TEXT,
  size_acres DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fields table
CREATE TABLE IF NOT EXISTS fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  size_acres DECIMAL NOT NULL,
  crop_type TEXT,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  thinking TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create satellite_data table
CREATE TABLE IF NOT EXISTS satellite_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  field_id UUID NOT NULL,
  ndvi_value DECIMAL NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  field_id UUID,
  type TEXT NOT NULL CHECK (type IN ('irrigation', 'weather', 'pest', 'disease', 'general')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user_id ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_satellite_data_field_id ON satellite_data(field_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);

-- Enable Row Level Security
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE satellite_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies (Allow all for testing - you can make them stricter later)
CREATE POLICY "Allow all operations" ON farmer_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON farms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON satellite_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON alerts FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_farmer_profiles_updated_at ON farmer_profiles;
DROP TRIGGER IF EXISTS update_farms_updated_at ON farms;
DROP TRIGGER IF EXISTS update_fields_updated_at ON fields;

-- Create triggers
CREATE TRIGGER update_farmer_profiles_updated_at BEFORE UPDATE ON farmer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
