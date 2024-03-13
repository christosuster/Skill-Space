import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import ViewCourse from "@/components/ViewCourse";
import ViewUnenrolledCourse from "@/components/ViewUnenrolledCourse";
import { toast } from "@/components/ui/use-toast";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

const ViewUnenrolledCoursePage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const session = await auth();
  const course = await prisma.course.findUnique({
    where: {
      id: params.id,
    },
    include: {
      creator: true,
    },
  });

  if (!course) {
    redirect("/courses");
  }

  const modules = await prisma.module.findMany({
    where: {
      courseId: course.id,
    },
  });

  const enrolled = await prisma.enrollment.findFirst({
    where: {
      studentId: session?.user?.id,
      AND: {
        courseId: course.id,
      },
    },
  });

  return (
    <div>
      <PageHeader text="All Courses" />
      <ViewUnenrolledCourse
        course={course}
        modules={modules}
        enrolled={enrolled}
      />
    </div>
  );
};

export default ViewUnenrolledCoursePage;
