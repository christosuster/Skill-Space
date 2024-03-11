import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { loginSchema } from "./lib/schema";
import bcrypt from "bcryptjs";

const credentialsConfig = Credentials({
  async authorize(credentials) {
    const validatedFields = loginSchema.safeParse(credentials);

    if (!validatedFields.success) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        username: validatedFields.data.username,
      },
    });

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(
      validatedFields.data.password,
      user.password
    );

    if (!passwordMatch) {
      return null;
    }

    return user;
  },
});

const config = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        // console.log("validatedFields", validatedFields);

        if (!validatedFields.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: validatedFields.data.username,
          },
        });

        // console.log("user", user);

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          validatedFields.data.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        console.log("user", user);

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
