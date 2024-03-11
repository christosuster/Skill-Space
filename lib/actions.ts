"use server";

import { signIn } from "@/auth";
import { z } from "zod";
import { loginSchema, signupSchema } from "./schema";
import prisma from "./prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/dist/server/api-utils";

export const signInWithCredentials = async (
  values: z.infer<typeof loginSchema>
) => {
  const valid = loginSchema.safeParse(values);

  if (!valid.success) {
    return {
      error: "Invalid input",
    };
  }

  const { username, password } = values;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return {
      error: "User not found",
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      error: "Invalid password",
    };
  }

  try {
    await signIn("credentials", {
      username: username,
      password: password,
      redirectTo: "/",
    });
  } catch (error) {
    // console.log("error", error);
    throw error;

    // return {
    //   error: "An error occurred while signing in the user. Please try again.",
    // };
  }

  return {
    success: "User created",
  };
};

export const createUser = async (values: z.infer<typeof signupSchema>) => {
  const valid = signupSchema.safeParse(values);

  if (!valid.success) {
    return {
      error: "Invalid input",
    };
  }

  const { name, username, password } = valid.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
    },
  });

  // try {
  //   await signIn("credentials", {
  //     username: user.username,
  //     password: user.password,
  //     redirectTo: "/",
  //   });
  // } catch (error) {
  //   return {
  //     error: "An error occurred while signing in the user. Please try again.",
  //   };
  // }

  return {
    success: "User created",
  };
};
