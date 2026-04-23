-- Deborah Jayne Designs — initial schema
-- Run this entire file in Supabase > SQL Editor > New query > Run.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT where possible.

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Tables ----------
create table if not exists public.portfolio (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  caption         text,
  writeup         text,
  year            int,
  category        text,
  image_url       text not null,
  thumbnail_url   text,
  alt_text        text not null default '',
  display_order   int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists portfolio_display_order_idx on public.portfolio (display_order asc);
create index if not exists portfolio_category_idx on public.portfolio (category);

create table if not exists public.site_content (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_set_updated_at on public.portfolio;
create trigger portfolio_set_updated_at
before update on public.portfolio
for each row execute function public.set_updated_at();

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
alter table public.portfolio enable row level security;
alter table public.site_content enable row level security;

-- Public read
drop policy if exists "portfolio readable by everyone" on public.portfolio;
create policy "portfolio readable by everyone"
  on public.portfolio for select
  using (true);

drop policy if exists "site_content readable by everyone" on public.site_content;
create policy "site_content readable by everyone"
  on public.site_content for select
  using (true);

-- Authenticated write (only the single admin user you create has an account)
drop policy if exists "portfolio writable by authenticated" on public.portfolio;
create policy "portfolio writable by authenticated"
  on public.portfolio for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "site_content writable by authenticated" on public.site_content;
create policy "site_content writable by authenticated"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

-- ---------- Storage bucket ----------
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = excluded.public;

-- Storage policies
drop policy if exists "portfolio-images public read" on storage.objects;
create policy "portfolio-images public read"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

drop policy if exists "portfolio-images authenticated write" on storage.objects;
create policy "portfolio-images authenticated write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-images');

drop policy if exists "portfolio-images authenticated update" on storage.objects;
create policy "portfolio-images authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-images');

drop policy if exists "portfolio-images authenticated delete" on storage.objects;
create policy "portfolio-images authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-images');

-- ---------- Seed data ----------
insert into public.site_content (key, value)
values (
  'about',
  'Deborah Jayne is an independent graphic designer working between editorial, identity, and illustration. Her practice sits at the intersection of craft and concept — considered typography, atmospheric imagery, and a measured restraint that lets the work breathe. Based in the UK, working worldwide.'
)
on conflict (key) do nothing;

insert into public.portfolio (title, slug, caption, writeup, year, category, image_url, thumbnail_url, alt_text, display_order)
values
  (
    'Slow Horizons',
    'slow-horizons',
    'Editorial series exploring stillness and scale.',
    'Slow Horizons is a six-piece editorial series commissioned for an independent quarterly. Each spread pairs a typographic treatment with a long, low-horizon photograph — the copy sets itself quietly against the image rather than competing with it.\n\nThe series was printed on uncoated stock in a restrained two-colour palette. Typography is set in a custom-stretched display serif alongside a monospace for captions, giving the work a documentary quality while still feeling composed.',
    2024,
    'Editorial',
    'https://picsum.photos/seed/djd-1/1600/1200',
    'https://picsum.photos/seed/djd-1/800/600',
    'Landscape photograph overlaid with editorial typography.',
    10
  ),
  (
    'Fieldwork',
    'fieldwork',
    'Identity system for a small architectural studio.',
    'Fieldwork is the identity for an independent architectural practice working primarily on rural and semi-rural sites. The wordmark is drawn from a condensed serif and paired with a grid-based secondary system built to carry technical drawings, photographic work, and writing.\n\nThe system is deliberately quiet — the studio''s work is the subject, and the identity recedes. A single warm accent appears only in printed collateral, never on-screen.',
    2023,
    'Identity',
    'https://picsum.photos/seed/djd-2/1600/1100',
    'https://picsum.photos/seed/djd-2/800/550',
    'Printed identity collateral laid out on a textured surface.',
    20
  ),
  (
    'Nightwatch',
    'nightwatch',
    'Poster illustration for an independent film screening.',
    'Nightwatch is a one-off poster for an independent cinema''s late-night programme. The illustration is hand-drawn and then run through a layered screenprint process, with the type set and letterspaced by hand to sit inside the composition rather than on top of it.\n\nThe final print is a single A2 screenprint in three inks on 250gsm recycled stock. A digital variant was produced for social and web.',
    2024,
    'Illustration',
    'https://picsum.photos/seed/djd-3/1400/1900',
    'https://picsum.photos/seed/djd-3/700/950',
    'Moody illustrated poster with hand-set typography.',
    30
  )
on conflict (slug) do nothing;
