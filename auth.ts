import NextAuth, { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";

const credentialsConfig = credentials({
  name: "credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (credentials.username === "admin" && credentials.password === "admin") {
      return { name: "admin" };
    } else return null;
  },
});

const config = {
  providers: [credentialsConfig],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
