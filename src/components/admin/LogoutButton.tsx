"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/admin/actions";

export default function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => start(() => signOutAction())}
      disabled={pending}
      className="text-sm text-ink/70 underline underline-offset-4 hover:text-ink disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Log out"}
    </button>
  );
}
