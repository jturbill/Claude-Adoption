import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-light tracking-tight text-bone">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-bone/60">
          Sign in to manage the portfolio and About section.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
