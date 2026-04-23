# Setup Guide

This walks you through everything needed to get the site live. Written for a
non-developer — no prior experience assumed. You&rsquo;ll need:

- A free [Supabase](https://supabase.com) account (for login, database, image storage)
- A free [Vercel](https://vercel.com) account (to host the site)
- A [GitHub](https://github.com) account (this repo lives there)

Total time, first time through: about **30–45 minutes**.

---

## 1. Create the Supabase project

1. Go to <https://supabase.com> and sign in.
2. Click **New project**.
3. Name it something like `deborah-jayne-designs`.
4. Set a strong database password (save it in your password manager — you
   probably won&rsquo;t need it again, but keep it safe).
5. Pick a region close to you.
6. Click **Create new project** and wait 1–2 minutes.

## 2. Run the database migration

1. In the Supabase dashboard, left sidebar → **SQL Editor**.
2. Click **New query**.
3. Open the file `supabase/migrations/0001_init.sql` from this repo. Copy its
   **entire contents** and paste into the SQL editor.
4. Click **Run** (bottom-right). You should see “Success. No rows returned.”
5. What this just did:
   - Created two tables: `portfolio` and `site_content`
   - Turned on Row Level Security with sensible policies (public can read,
     only you can write)
   - Created the `portfolio-images` storage bucket with the same rules
   - Added 3 placeholder portfolio pieces and a default About paragraph so
     the site looks populated on first load

You can safely re-run this file later — it uses `IF NOT EXISTS` and
`ON CONFLICT` where it matters.

## 3. Create Deborah&rsquo;s admin account

Since there&rsquo;s no public signup, create the one admin user manually:

1. Supabase dashboard → **Authentication** → **Users** → **Add user** →
   **Create new user**.
2. Enter her email address and a strong password.
3. Check **Auto Confirm User** (so she can log in immediately without
   clicking an email link).
4. Click **Create user**.

That&rsquo;s the only account that will ever exist — because there&rsquo;s no signup
page, nobody else can create one.

## 4. Get your Supabase keys

1. Supabase dashboard → **Project Settings** (bottom-left gear) → **API**.
2. Copy these three values somewhere safe — you&rsquo;ll paste them into
   Vercel in a moment:
   - **Project URL** (e.g. `https://abcdefg.supabase.co`)
   - **anon public** key (a long string starting with `eyJ…`)
   - **service_role** key (another long string — treat this like a password;
     never share it)

## 5. Push the code to GitHub

If the repo isn&rsquo;t already on GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create deborah-jayne-designs --private --source=. --push
```

(Or create the repo in the GitHub UI and follow the instructions it gives.)

## 6. Deploy to Vercel

1. Go to <https://vercel.com> and sign in with GitHub.
2. Click **Add New → Project**.
3. Select the `deborah-jayne-designs` repo. Vercel will auto-detect Next.js.
4. Under **Environment Variables**, add the following. Copy values exactly.
   - `NEXT_PUBLIC_SUPABASE_URL` → your Project URL from step 4
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → the anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` → the service_role key
   - `NEXT_PUBLIC_SITE_URL` → leave blank for now, or set to
     `https://<your-project>.vercel.app`
   - `NEXT_PUBLIC_CONTACT_EMAIL` → the email address shown on the Contact
     section (e.g. `hello@deborahjaynedesigns.com`)
5. Click **Deploy**. First build takes about 2 minutes.
6. When it&rsquo;s done, you&rsquo;ll see a live URL like
   `https://deborah-jayne-designs.vercel.app`.

## 7. Tell Supabase about your site URL

So login redirects work properly:

1. Supabase dashboard → **Authentication** → **URL Configuration**.
2. **Site URL** → set to your Vercel URL (e.g. `https://deborah-jayne-designs.vercel.app`).
3. **Redirect URLs** → add the same URL, and also `http://localhost:3000` if
   you plan to run the site on your laptop.
4. Click **Save**.

## 8. Log in and try it out

1. Go to `https://<your-site>/admin/login`
2. Enter the email and password you created in step 3
3. You should land on the admin dashboard with the 3 placeholder pieces.

Try it out:

- Click **Add new** and upload a real piece of work. It replaces one of the
  placeholders in display order.
- Open the dashboard, drag a row to reorder, watch the public site update.
- Click **About**, edit the text, save.
- Click **Log out** and check that `/admin` now redirects you to the login
  page.

## 9. (Optional) Custom domain

In Vercel → your project → **Settings** → **Domains**, add
`deborahjaynedesigns.com`. Vercel shows the DNS records to add at your domain
registrar. Once DNS has propagated (usually under an hour), HTTPS is automatic.

Then go back to **Supabase → Authentication → URL Configuration** and update
the Site URL to your custom domain.

---

## Troubleshooting

**“Invalid login credentials” when signing in.**
Double-check the email is exact and that you clicked **Auto Confirm User**
when creating the account. If not, resend a confirmation from
**Authentication → Users** or delete and recreate the user.

**Images don&rsquo;t appear on the public site after upload.**
- In Supabase → **Storage**, confirm the `portfolio-images` bucket exists and
  is marked **Public**.
- Check Vercel → your project → **Deployments → [latest] → Functions logs**
  for errors from the `createPieceAction` server action.

**“Not authenticated” errors when trying to save in admin.**
Your session cookies probably expired. Log out and back in.

**Local dev works but Vercel deploy fails.**
Check all five environment variables are set in Vercel (step 6). The
`SUPABASE_SERVICE_ROLE_KEY` in particular must NOT have the `NEXT_PUBLIC_`
prefix.

**I want to change the accent colour / fonts.**
Both live in `tailwind.config.ts` (`theme.extend.colors.accent` and the
`font-display` / `font-sans` variables). Fonts are loaded in
`src/app/layout.tsx` via `next/font/google`.
