import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import ViewCourse from "@/components/ViewCourse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import prisma from "@/lib/prisma";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const viewCoursePage = async ({
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
  });

  if (!course) {
    redirect("/");
  }

  const modules = await prisma.module.findMany({
    where: {
      courseId: course.id,
    },
  });

  const creator = await prisma.user.findUnique({
    where: {
      id: course.creatorId,
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

export default viewCoursePage;
