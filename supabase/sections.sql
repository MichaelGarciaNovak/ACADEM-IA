-- Run this in Supabase SQL Editor

create table if not exists sections (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'hero',        -- 'hero' | 'features' | 'courses' | 'cta'
  title       text not null default '',
  subtitle    text,
  cta_text    text,
  cta_link    text,
  bg_color    text not null default '#171a21',
  accent_color text not null default '#ef476f',
  texture_symbol text not null default 'ΛCΛDEM*IΛ',
  published   boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz default now()
);

-- Optional: disable RLS while you develop (same pattern as profiles)
alter table sections disable row level security;
