import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import ViewCourse from "@/components/ViewCourse";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const viewEnrolledCoursePage = async ({
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
    redirect("/");
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
      <PageHeader text="My Course" />
      <ViewCourse course={course} modules={modules} enrolled={enrolled} />
    </div>
  );
};

export default viewEnrolledCoursePage;
