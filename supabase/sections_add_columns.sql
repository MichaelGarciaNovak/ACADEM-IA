-- Run in Supabase SQL Editor
alter table sections
  add column if not exists text_color text not null default '#dddfdf',
  add column if not exists texture_opacity integer not null default 5,
  add column if not exists texture_color text not null default '#ef476f';
-- texture_opacity is 1–20 (represents percentage)
