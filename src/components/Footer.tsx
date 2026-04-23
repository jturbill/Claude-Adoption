export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-bone/10 px-6 py-10 text-xs uppercase tracking-[0.24em] text-bone/50 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p>© {year} Deborah Jayne Designs</p>
        <p>
          <a href="#top" className="hover:text-bone">
            Back to top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
