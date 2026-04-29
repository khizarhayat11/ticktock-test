import crypto from "crypto";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const DUMMY_USER = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  password: "password",
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        const isValid = email === DUMMY_USER.email && password === DUMMY_USER.password;
        if (!isValid) return null;

        const payload = `${DUMMY_USER.id}:${Date.now()}`;
        const accessToken = crypto
          .createHmac("sha256", process.env.NEXTAUTH_SECRET ?? "secret")
          .update(payload)
          .digest("hex");

        return {
          id: DUMMY_USER.id,
          name: DUMMY_USER.name,
          email: DUMMY_USER.email,
          accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};
