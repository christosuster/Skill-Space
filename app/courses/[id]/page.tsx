import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import ViewUnenrolledCourse from "@/components/ViewUnenrolledCourse";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  console.log("Session", session?.user?.id);

  const enrolled = await prisma.enrollment.findFirst({
    where: {
      studentId: session?.user?.id,
      courseId: course.id,
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
