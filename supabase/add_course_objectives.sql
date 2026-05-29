-- Add value proposition + learning objectives to courses
-- Run this in Supabase SQL Editor

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS value_proposition   text,
  ADD COLUMN IF NOT EXISTS learning_objective_1 text,
  ADD COLUMN IF NOT EXISTS learning_objective_2 text,
  ADD COLUMN IF NOT EXISTS learning_objective_3 text,
  ADD COLUMN IF NOT EXISTS learning_objective_4 text;
