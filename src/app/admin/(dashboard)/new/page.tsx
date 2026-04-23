import PieceForm from "@/components/admin/PieceForm";

export const dynamic = "force-dynamic";

export default function NewPiecePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
        Add a new piece
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Upload an image, fill in the details, and it will appear on the public site.
      </p>
      <div className="mt-10">
        <PieceForm mode="create" />
      </div>
    </div>
  );
}
