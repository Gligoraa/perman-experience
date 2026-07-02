/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const normalizedRole =
    typeof role === "string" ? role.trim().toLowerCase() : role;

  if (!session || normalizedRole !== "admin") {
    redirect("/admin/login");
  }

  return <div className="min-h-screen bg-black text-white">{children}</div>;
}
