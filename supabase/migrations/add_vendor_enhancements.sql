-- Vendor Dashboard Enhancement Migration
-- Creates tables for milestones and clients, adds address field to vendors

-- 1. Add address column to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. Create vendor_milestones table
CREATE TABLE IF NOT EXISTS vendor_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  milestone_date DATE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vendor_milestones_vendor_id ON vendor_milestones(vendor_id);

-- 3. Create vendor_clients table
CREATE TABLE IF NOT EXISTS vendor_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vendor_clients_vendor_id ON vendor_clients(vendor_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE vendor_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_clients ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies (adjust based on your auth setup)
-- Allow public read access
CREATE POLICY "Allow public read access on vendor_milestones"
  ON vendor_milestones FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on vendor_clients"
  ON vendor_clients FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update/delete (adjust as needed)
CREATE POLICY "Allow authenticated insert on vendor_milestones"
  ON vendor_milestones FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on vendor_milestones"
  ON vendor_milestones FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on vendor_milestones"
  ON vendor_milestones FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on vendor_clients"
  ON vendor_clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on vendor_clients"
  ON vendor_clients FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on vendor_clients"
  ON vendor_clients FOR DELETE
  TO authenticated
  USING (true);
