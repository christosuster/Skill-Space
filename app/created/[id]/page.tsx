import { auth } from "@/auth";
import AddModule from "@/components/AddModule";
import EditCourse from "@/components/EditCourse";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { Edit } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

const editCoursePage = async ({
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

  if (course.creatorId != session?.user?.id) {
    redirect(`/courses/${params.id}`);
  }

  const modules = await prisma.module.findMany({
    where: {
      courseId: course.id,
    },
  });

  return (
    <div>
      <PageHeader text="Edit Course" />
      <EditCourse session={session} course={course} modules={modules} />
    </div>
  );
};

export default editCoursePage;
