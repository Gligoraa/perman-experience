"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Pogre\u0161an e-mail ili lozinka. Poku\u0161ajte ponovo.");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-light text-white">Prijava za administratore</h1>
          <p className="text-sm text-white/40">
            {'Unesite svoje podatke za pristup nadzornoj plo\u010di'}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-500">
              E-mail adresa
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-500">
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 py-4 font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-600"
          >
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
}
