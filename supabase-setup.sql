-- VAT Invoice System Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create invoice_sheets table
CREATE TABLE IF NOT EXISTS invoice_sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sheet_name TEXT NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_vat DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_invoice_sheets_user_id ON invoice_sheets(user_id);
CREATE INDEX IF NOT EXISTS idx_invoice_sheets_created_at ON invoice_sheets(created_at DESC);

-- Enable Row Level Security
ALTER TABLE invoice_sheets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own sheets" ON invoice_sheets;
DROP POLICY IF EXISTS "Users can insert own sheets" ON invoice_sheets;
DROP POLICY IF EXISTS "Users can update own sheets" ON invoice_sheets;
DROP POLICY IF EXISTS "Users can delete own sheets" ON invoice_sheets;

-- Create policies for users to access only their own data
CREATE POLICY "Users can view own sheets" ON invoice_sheets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sheets" ON invoice_sheets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sheets" ON invoice_sheets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sheets" ON invoice_sheets
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_invoice_sheets_updated_at ON invoice_sheets;
CREATE TRIGGER update_invoice_sheets_updated_at
    BEFORE UPDATE ON invoice_sheets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON invoice_sheets TO authenticated;
GRANT SELECT ON invoice_sheets TO anon;