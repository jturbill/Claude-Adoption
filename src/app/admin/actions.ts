"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

const BUCKET = "portfolio-images";
const THUMB_WIDTH = 900;
const FULL_MAX_WIDTH = 2400;

// Ensure the caller is authenticated. Throws for client safety.
async function assertAuthed() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

// Process an image: resize the original (bounded) and generate a thumbnail,
// both as optimised JPEGs. Returns the two Buffers + content type.
async function processImage(file: File) {
  const buf = Buffer.from(await file.arrayBuffer());

  const base = sharp(buf, { failOn: "none" }).rotate(); // respect EXIF orientation

  const full = await base
    .clone()
    .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  const thumb = await base
    .clone()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  return { full, thumb, contentType: "image/jpeg" as const };
}

// Upload both variants to the storage bucket and return their public URLs.
async function uploadVariants(pieceId: string, file: File) {
  const svc = createSupabaseServiceClient();
  const { full, thumb, contentType } = await processImage(file);

  const fullKey = `full/${pieceId}.jpg`;
  const thumbKey = `thumb/${pieceId}.jpg`;

  const [fullRes, thumbRes] = await Promise.all([
    svc.storage.from(BUCKET).upload(fullKey, full, {
      contentType,
      upsert: true,
      cacheControl: "31536000, immutable",
    }),
    svc.storage.from(BUCKET).upload(thumbKey, thumb, {
      contentType,
      upsert: true,
      cacheControl: "31536000, immutable",
    }),
  ]);

  if (fullRes.error) throw fullRes.error;
  if (thumbRes.error) throw thumbRes.error;

  const image_url = svc.storage.from(BUCKET).getPublicUrl(fullKey).data.publicUrl;
  const thumbnail_url = svc.storage.from(BUCKET).getPublicUrl(thumbKey).data.publicUrl;

  return { image_url, thumbnail_url };
}

// Helper: generate a unique slug given a desired base and an optional id to ignore.
async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  let candidate = slugify(base);
  let suffix = 1;

  while (true) {
    const { data, error } = await supabase
      .from("portfolio")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (error) throw error;
    if (!data || data.id === ignoreId) return candidate;
    suffix += 1;
    candidate = `${slugify(base)}-${suffix}`;
  }
}

export type ActionResult = { ok: true } | { ok: false; error: string };

// ---------- Create piece ----------
export async function createPieceAction(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await assertAuthed();

    const title = String(formData.get("title") || "").trim();
    const caption = String(formData.get("caption") || "").trim() || null;
    const writeup = String(formData.get("writeup") || "").trim() || null;
    const yearRaw = String(formData.get("year") || "").trim();
    const year = yearRaw ? Number(yearRaw) : null;
    const category = String(formData.get("category") || "").trim() || null;
    const alt_text = String(formData.get("alt_text") || "").trim();
    const orderRaw = String(formData.get("display_order") || "").trim();
    const display_order = orderRaw ? Number(orderRaw) : 0;
    const file = formData.get("image") as File | null;

    if (!title) return { ok: false, error: "Title is required." };
    if (!alt_text) return { ok: false, error: "Alt text is required for accessibility." };
    if (!file || file.size === 0) return { ok: false, error: "Please choose an image to upload." };
    if (file.size > 12 * 1024 * 1024) return { ok: false, error: "Image must be under 12 MB." };

    const slug = await ensureUniqueSlug(title);

    // Insert the row first so the uploaded files share its id.
    const { data: inserted, error: insertErr } = await supabase
      .from("portfolio")
      .insert({
        title,
        slug,
        caption,
        writeup,
        year,
        category,
        alt_text,
        display_order,
        image_url: "", // temporary; replaced right after upload
      })
      .select("id")
      .single();
    if (insertErr) throw insertErr;

    const { image_url, thumbnail_url } = await uploadVariants(inserted.id, file);

    const { error: updateErr } = await supabase
      .from("portfolio")
      .update({ image_url, thumbnail_url })
      .eq("id", inserted.id);
    if (updateErr) throw updateErr;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- Update piece ----------
export async function updatePieceAction(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await assertAuthed();

    const id = String(formData.get("id") || "");
    if (!id) return { ok: false, error: "Missing id." };

    const title = String(formData.get("title") || "").trim();
    const caption = String(formData.get("caption") || "").trim() || null;
    const writeup = String(formData.get("writeup") || "").trim() || null;
    const yearRaw = String(formData.get("year") || "").trim();
    const year = yearRaw ? Number(yearRaw) : null;
    const category = String(formData.get("category") || "").trim() || null;
    const alt_text = String(formData.get("alt_text") || "").trim();
    const orderRaw = String(formData.get("display_order") || "").trim();
    const display_order = orderRaw ? Number(orderRaw) : 0;
    const file = formData.get("image") as File | null;

    if (!title) return { ok: false, error: "Title is required." };
    if (!alt_text) return { ok: false, error: "Alt text is required for accessibility." };

    const slug = await ensureUniqueSlug(title, id);

    const update: Record<string, unknown> = {
      title,
      slug,
      caption,
      writeup,
      year,
      category,
      alt_text,
      display_order,
    };

    if (file && file.size > 0) {
      if (file.size > 12 * 1024 * 1024) {
        return { ok: false, error: "Image must be under 12 MB." };
      }
      const { image_url, thumbnail_url } = await uploadVariants(id, file);
      update.image_url = image_url;
      update.thumbnail_url = thumbnail_url;
    }

    const { error } = await supabase.from("portfolio").update(update).eq("id", id);
    if (error) throw error;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- Delete piece ----------
export async function deletePieceAction(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await assertAuthed();
    const svc = createSupabaseServiceClient();

    // Best-effort remove storage objects — ignore errors so a missing file
    // doesn't block deleting the DB row.
    await svc.storage.from(BUCKET).remove([`full/${id}.jpg`, `thumb/${id}.jpg`]);

    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

// ---------- Reorder pieces ----------
export async function reorderPiecesAction(
  orderedIds: string[]
): Promise<ActionResult> {
  try {
    const { supabase } = await assertAuthed();

    // Assign display_order in multiples of 10 so manual inserts are easy.
    await Promise.all(
      orderedIds.map((id, index) =>
        supabase
          .from("portfolio")
          .update({ display_order: (index + 1) * 10 })
          .eq("id", id)
      )
    );
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Reorder failed." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

// ---------- About text ----------
export async function updateAboutAction(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await assertAuthed();

    const value = String(formData.get("about") || "").trim();
    if (!value) return { ok: false, error: "About text can't be empty." };

    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "about", value }, { onConflict: "key" });
    if (error) throw error;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save." };
  }

  revalidatePath("/");
  revalidatePath("/admin/about");
  return { ok: true };
}

// ---------- Sign out ----------
export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
