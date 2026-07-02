import { NextAuthOptions, type User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      // Credentials authorize() returns a plain object; we only care about role here.
      user?:
        | ((User | AdapterUser) & { role?: string })
        | undefined;
    }) {
      if (user?.role) (token as { role?: string }).role = user.role;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as { role?: string }).role = (token as { role?: string }).role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
