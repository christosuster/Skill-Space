"use server";

import { auth, signIn } from "@/auth";
import { z } from "zod";
import { loginSchema, signupSchema } from "./schema";
import prisma from "./prisma";
import bcrypt from "bcrypt";
import { formDataType, moduleFormDataType } from "./types";

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

export const addCourse = async (data: formDataType) => {
  const session = await auth();

  try {
    const res = await prisma.course.create({
      data: {
        title: data.courseTitle,
        description: data.courseDescription,
        imageUrl: data.courseImage,
        creatorId: session?.user?.id!,
      },
    });

    if (!res) {
      return {
        error: "Could not create the course!",
        success: null,
      };
    }

    return {
      success: res,
      error: null,
    };
  } catch (error) {
    return {
      error: "Unexpected error occured!",
      success: null,
    };
  }
};

export const addModule = async (data: moduleFormDataType) => {
  const session = await auth();

  try {
    const res = await prisma.module.create({
      data: {
        title: data.moduleTitle,
        description: data.moduleDescription,
        videoUrl: data.moduleVideo,
        courseId: data.courseId,
      },
    });

    if (!res) {
      return {
        error: "Module creation failed!",
        success: null,
      };
    }

    return {
      success: res,
      error: null,
    };
  } catch (error) {
    return {
      error: "Unexpected error occured!",
      success: null,
    };
  }
};

export const enroll = async (courseId: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "User not found",
      success: null,
    };
  }

  try {
    const res = await prisma.enrollment.create({
      data: {
        courseId: courseId,
        studentId: session.user.id!,
      },
    });

    if (!res) {
      return {
        error: "Enrollment failed!",
        success: null,
      };
    }

    return {
      success: res,
      error: null,
    };
  } catch (error) {
    return {
      error: "Unexpected error occured!",
      success: null,
    };
  }
};
