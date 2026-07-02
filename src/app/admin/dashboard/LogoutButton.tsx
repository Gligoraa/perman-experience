"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-white/60 px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/5"
    >
      <LogOut className="w-4 h-4" />
      Odjavi se
    </button>
  );
}
