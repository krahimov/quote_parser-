-- Hotel Quote Parser - Database Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_name TEXT,
  event_name TEXT,
  check_in_date TEXT,
  check_out_date TEXT,
  total_quote TEXT,
  guestroom_total TEXT,
  meeting_room_total TEXT,
  food_beverage_total TEXT,
  additional_details JSONB DEFAULT '{}',
  raw_content TEXT,
  source_type TEXT CHECK (source_type IN ('paste', 'html_upload', 'pdf_upload')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional, disable if not using auth)
-- ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON quotes FOR ALL USING (true);
