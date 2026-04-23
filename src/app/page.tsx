import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PortfolioPiece } from "@/lib/types";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PortfolioSection from "@/components/PortfolioSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: pieces }, { data: about }] = await Promise.all([
    supabase
      .from("portfolio")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase.from("site_content").select("value").eq("key", "about").maybeSingle(),
  ]);

  const aboutText =
    about?.value ??
    "Independent graphic designer working between editorial, identity, and illustration.";

  return (
    <>
      <RevealOnScroll />
      <main id="main" className="relative z-0">
        <Hero />
        <About text={aboutText} />
        <PortfolioSection pieces={(pieces ?? []) as PortfolioPiece[]} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
