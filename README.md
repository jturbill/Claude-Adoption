# Deborah Jayne Designs — Portfolio Site

A moody, atmospheric portfolio for independent graphic designer Deborah Jayne.
Next.js + Supabase + Tailwind. Free-tier friendly.

- **Public site** — `/` — hero, about, portfolio grid (with category filter),
  contact, footer. Lightbox with keyboard nav (Esc, ←, →).
- **Admin** — `/admin` — login-gated. Add, edit, reorder, and delete pieces;
  edit the About text.

First time here? Start with [**SETUP.md**](./SETUP.md). Once the site is live,
keep this file handy — it covers the day-to-day.

---

## For Deborah — day-to-day use

### How do I log in?

1. Go to `https://<your-site>/admin/login`
2. Enter your email and password
3. You&rsquo;ll land on the admin dashboard

### How do I add a new portfolio piece?

1. From the admin dashboard, click **Add new**
2. Drag an image into the drop zone (or click to choose). Max 12 MB.
3. Fill in:
   - **Title** (required)
   - **Category** — e.g. Editorial, Identity, Illustration. Whatever you type
     here becomes a filter chip on the public site, so keep the spelling
     consistent across pieces.
   - **Year**
   - **Alt text** (required) — a short sentence describing what the image
     shows, used by screen readers
   - **Caption** — one short line shown on hover
   - **Write-up** — 200–400 words. Markdown works: blank line = new paragraph,
     `**bold**`, `*italic*`, `[link text](https://…)`.
   - **Display order** — leave it at 0 to put the piece at the top, or use
     drag-and-drop back on the dashboard.
4. Click **Publish piece**. The public site updates within about a minute.

### How do I edit or delete a piece?

- **Edit** — on the dashboard, click **Edit** next to the piece. Update any
  field. To replace the image, drop a new one into the image area.
- **Delete** — click **Delete**. You&rsquo;ll be asked to confirm. The image
  files are removed from storage as well.

### How do I reorder pieces?

On the admin dashboard, grab the dotted handle on the left of any row and drag
it up or down. The new order saves automatically.

### How do I edit the About section?

1. Click **About** in the admin nav
2. Edit the text. Leave a blank line between paragraphs.
3. Click **Save**

### How do I log out?

Top-right of the admin screen, click **Log out**.

### I&rsquo;ve forgotten my password. How do I reset it?

This site doesn&rsquo;t have a public password-reset page yet. To reset:

1. Go to your Supabase project dashboard → **Authentication** → **Users**
2. Find your account, click the `…` menu, choose **Send password recovery**
3. Check your email for the reset link

If you don&rsquo;t have access to Supabase, ask whoever set the site up to do
this for you — it takes them under a minute.

---

## For developers

### Local development

```bash
cp .env.example .env.local   # fill in Supabase values
npm install
npm run dev                   # http://localhost:3000
```

### Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run start       # production server
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

### Stack

- Next.js 15 (App Router, TypeScript, server components by default)
- Supabase (Auth + Postgres + Storage)
- Tailwind CSS 3
- `@supabase/ssr` for cookie-based auth
- `sharp` for server-side image resizing / thumbnail generation
- `@dnd-kit` for drag-and-drop reordering
- `react-markdown` for rendering writeups in the lightbox

### Project layout

```
src/
  app/
    layout.tsx             Root layout (fonts, grain, metadata)
    page.tsx               Public homepage (server component)
    not-found.tsx          404 page
    globals.css            Tailwind + global styles
    admin/
      login/page.tsx       Login (minimal chrome)
      (dashboard)/         Route group with admin chrome
        layout.tsx
        page.tsx           Dashboard (list, reorder, delete)
        new/page.tsx
        edit/[id]/page.tsx
        about/page.tsx
    actions.ts             Server actions (create, update, delete, reorder, about, sign out)
  components/              Public + admin components
  lib/
    supabase/              server, client, middleware helpers
    types.ts
    slug.ts
  middleware.ts            Refreshes auth + gates /admin/*
supabase/
  migrations/0001_init.sql Tables, RLS, storage bucket, seed data
```

### How the admin is protected

- `src/middleware.ts` runs on every request and calls `updateSession`, which
  refreshes the Supabase auth cookies and redirects unauthenticated visitors
  from `/admin/*` to `/admin/login`.
- Row Level Security on `portfolio` and `site_content` allows public `SELECT`
  but restricts writes to authenticated users. Since only Deborah&rsquo;s
  account exists, effectively only she can write.
- There is **no** public signup route.

### Notes on image handling

- Uploaded images are re-encoded as JPEG with `sharp`:
  - **Full** variant: bounded to 2400px wide, quality 86
  - **Thumb** variant: bounded to 900px wide, quality 78
- Both are uploaded to the public `portfolio-images` bucket under
  `full/{pieceId}.jpg` and `thumb/{pieceId}.jpg`. Deleting a piece removes
  both objects.
- `next/image` serves them with responsive `sizes` and long cache headers.
