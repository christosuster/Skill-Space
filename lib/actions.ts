"use server";

import { auth, signIn } from "@/auth";
import { z } from "zod";
import { loginSchema, signupSchema } from "./schema";
import prisma from "./prisma";
import bcrypt from "bcrypt";
import { formDataType, moduleFormDataType } from "./types";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/", "layout");

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

    revalidatePath("/", "layout");

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

  const res = await prisma.enrollment.findFirst({
    where: {
      courseId: courseId,
      studentId: session.user.id!,
    },
  });

  if (res) {
    return {
      error: "You are already enrolled in this course!",
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

    revalidatePath("/", "layout");

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

export const unenroll = async (courseId: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "User not found",
      success: null,
    };
  }

  try {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        courseId: courseId,
        studentId: session.user.id!,
      },
    });

    if (!enrollment) {
      return {
        error: "You are not enrolled in this course!",
        success: null,
      };
    }

    const res = await prisma.enrollment.delete({
      where: {
        id: enrollment.id,
      },
    });

    if (!res) {
      return {
        error: "Unenrollment failed!",
        success: null,
      };
    }

    revalidatePath("/", "layout");

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

export const deleteCourse = async (courseId: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "User not found",
      success: null,
    };
  }

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return {
        error: "Course not found",
        success: null,
      };
    }

    if (course.creatorId != session?.user?.id) {
      return {
        error: "You are not authorized to delete this course",
        success: null,
      };
    }

    const unenrollStudents = await prisma.enrollment.deleteMany({
      where: {
        courseId: courseId,
      },
    });

    if (!unenrollStudents) {
      return {
        error: "Deletion failed!",
        success: null,
      };
    }

    const deleteModules = await prisma.module.deleteMany({
      where: {
        courseId: courseId,
      },
    });

    if (!deleteModules) {
      return {
        error: "Deletion failed!",
        success: null,
      };
    }

    const res = await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    if (!res) {
      return {
        error: "Deletion failed!",
        success: null,
      };
    }

    revalidatePath("/", "layout");

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

export const deleteModule = async (moduleId: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "User not found",
      success: null,
    };
  }

  try {
    const courseModule = await prisma.module.findUnique({
      where: {
        id: moduleId,
      },
    });

    if (!courseModule) {
      return {
        error: "Module not found",
        success: null,
      };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseModule.courseId,
      },
    });

    if (!course) {
      return {
        error: "Course not found",
        success: null,
      };
    }

    if (course.creatorId != session?.user?.id) {
      return {
        error: "You are not authorized to delete this module",
        success: null,
      };
    }

    const res = await prisma.module.delete({
      where: {
        id: moduleId,
      },
    });

    if (!res) {
      return {
        error: "Deletion failed!",
        success: null,
      };
    }

    revalidatePath("/", "layout");

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
