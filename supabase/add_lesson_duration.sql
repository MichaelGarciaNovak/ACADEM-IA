-- Add duration_minutes to course_lessons
-- Run this in Supabase SQL Editor

ALTER TABLE course_lessons
  ADD COLUMN IF NOT EXISTS duration_minutes integer;
