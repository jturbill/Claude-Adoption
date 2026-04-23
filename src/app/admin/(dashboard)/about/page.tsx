import { createSupabaseServerClient } from "@/lib/supabase/server";
import AboutEditor from "@/components/admin/AboutEditor";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "about")
    .maybeSingle();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
        About section
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Edit the short bio shown on the homepage. Leave a blank line between paragraphs.
      </p>
      <div className="mt-10">
        <AboutEditor initial={data?.value ?? ""} />
      </div>
    </div>
  );
}
