-- ============================================================
-- ACADEM*IA — Course System Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Course categories
create table if not exists course_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Courses
create table if not exists courses (
  id                      uuid primary key default gen_random_uuid(),
  category_id             uuid references course_categories(id) on delete set null,
  title                   text not null,
  description             text,
  image_url               text,
  theory_hours            numeric(5,1) not null default 0,
  theory_price_per_hour   numeric(10,2) not null default 0,
  practice_hours          numeric(5,1) not null default 0,
  practice_price_per_hour numeric(10,2) not null default 0,
  published               boolean not null default false,
  sort_order              integer not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Chapters (belong to course)
create table if not exists course_chapters (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  title       text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Lessons (belong to chapter)
create table if not exists course_lessons (
  id                  uuid primary key default gen_random_uuid(),
  chapter_id          uuid not null references course_chapters(id) on delete cascade,
  title               text not null,
  description         text,
  video_url           text,
  presentation_url    text,
  pdf_url             text,
  worksheet_url       text,
  tool_url            text,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Enrollments (user enrolled in course)
create table if not exists course_enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_id   uuid not null references courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique(user_id, course_id)
);

-- Lesson progress (user completed a lesson)
create table if not exists lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    uuid not null references course_lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

-- Comments (per lesson)
create table if not exists lesson_comments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_id   uuid not null references course_lessons(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Indexes for performance
-- ============================================================
create index if not exists idx_courses_category on courses(category_id);
create index if not exists idx_chapters_course on course_chapters(course_id, sort_order);
create index if not exists idx_lessons_chapter on course_lessons(chapter_id, sort_order);
create index if not exists idx_enrollments_user on course_enrollments(user_id);
create index if not exists idx_enrollments_course on course_enrollments(course_id);
create index if not exists idx_progress_user on lesson_progress(user_id);
create index if not exists idx_progress_lesson on lesson_progress(lesson_id);
create index if not exists idx_comments_lesson on lesson_comments(lesson_id, created_at);

-- ============================================================
-- Auto-update updated_at on courses and lessons
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger courses_updated_at
  before update on courses
  for each row execute function update_updated_at();

create trigger lessons_updated_at
  before update on course_lessons
  for each row execute function update_updated_at();

-- ============================================================
-- Seed: default categories
-- ============================================================
insert into course_categories (name, slug, sort_order) values
  ('Desarrollo', 'desarrollo', 1),
  ('Diseño', 'diseno', 2),
  ('Datos', 'datos', 3),
  ('Inteligencia Artificial', 'ia', 4),
  ('Negocios', 'negocios', 5),
  ('Marketing', 'marketing', 6)
on conflict (slug) do nothing;
