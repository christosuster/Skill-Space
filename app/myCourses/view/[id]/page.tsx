import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import prisma from "@/lib/prisma";
import { PlayCircle } from "lucide-react";
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

  const enroll = async () => {
    "use server";
    if (!session?.user) {
      return;
    }

    try {
      const res = await prisma.enrollment.create({
        data: {
          courseId: course.id,
          studentId: session.user.id!,
        },
      });

      if (!res) {
        toast({
          title: "Enrollment failed!",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Enrolled successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Unexpected error occured!",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: `url('${course.imageUrl}')`,
        }}
        className="h-96 bg-cover bg-center bg-no-repeat rounded"
      >
        <div className="text-white bg-gray-900/30 backdrop-blur h-full flex flex-col justify-center text-left px-10 gap-2 rounded">
          <h1 className="text-4xl">{course.title}</h1>
          <h1 className="text-background/80">{course.description}</h1>
          <h1 className="font-thin">By {creator?.name}</h1>
          {enrolled ? (
            <Button className="w-32 mt-10" disabled variant={"secondary"}>
              Already Enrolled
            </Button>
          ) : (
            <form action={enroll}>
              <Button
                type="submit"
                className="w-32 mt-10"
                variant={"secondary"}
              >
                Enroll Now
              </Button>
            </form>
          )}

          <h1 className="">
            <span className="font-bold">200</span> already enrolled
          </h1>
        </div>
      </div>
      <div className="w-full h-full mt-10 ">
        <div className="h-full flex flex-col gap-2">
          {modules.map((module, idx) => {
            return (
              <div
                key={module.id}
                className="border border-border flex p-3 rounded-xl gap-2 hover:shadow-xl transition-all"
              >
                <div className=" w-12 flex justify-center items-center">
                  <h1 className="text-2xl">{idx}</h1>
                </div>
                <div className="text-left flex-1 flex">
                  <div className="flex-1">
                    <h1 className="text-xl font-bold">{module.title}</h1>
                    <h1>{module.description}</h1>
                    {/* <h1>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Ea, tenetur quisquam. Vitae ab ratione corporis sequi enim
                      atque ea soluta molestias, illum itaque minus, libero amet
                      quod et natus! Corporis.
                    </h1> */}
                  </div>
                  <div className="h-full w-12 flex justify-center items-center">
                    <Link href={`/myCourses/view/${module.courseId}`}>
                      <PlayCircle className="w-10 h-10" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default viewCoursePage;
