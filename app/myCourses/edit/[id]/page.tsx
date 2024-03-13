import { auth } from "@/auth";
import AddModule from "@/components/AddModule";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  });

  if (!course) {
    redirect("/");
  }

  if (course.creatorId != session?.user?.id) {
    redirect(`/view/${params.id}`);
  }

  const modules = await prisma.module.findMany({
    where: {
      courseId: course.id,
    },
  });

  return (
    <div>
      <PageHeader text="Edit Course" />
      <div className="grid grid-cols-12  gap-4">
        <div className="w-full col-span-12 md:col-span-6 lg:col-span-4 ">
          <Image
            src={course.imageUrl}
            alt="Course Picture"
            width={1000}
            height={300}
            className="w-full aspect-video object-cover rounded-lg shadow-xl"
          />
          <div className="py-5">
            <div className="grid grid-cols-3 text-xl gap-4 items-end">
              <h1 className="col-span-1 text-accent-foreground font-semibold">
                Title
              </h1>
              <h1 className="col-span-2">: {course.title}</h1>
            </div>
            <div className="grid grid-cols-3 text-xl gap-4 items-end ">
              <h1 className="col-span-1 text-accent-foreground font-semibold">
                Description
              </h1>
              <h1 className="col-span-2">: {course.description}</h1>
            </div>
            <div className="grid grid-cols-3 text-xl gap-4 items-end">
              <h1 className="col-span-1 text-accent-foreground font-semibold">
                Author
              </h1>
              <h1 className="col-span-2">: Christos</h1>
            </div>
            <div className="grid grid-cols-3 text-xl gap-4 items-end">
              <h1 className="col-span-1 text-accent-foreground font-semibold">
                Created On
              </h1>
              <h1 className="col-span-2">
                : {course.createdAt.toDateString()}
              </h1>
            </div>
          </div>
        </div>

        <Card className="p-5 w-full col-span-12 md:col-span-6 lg:col-span-8">
          <h1 className="text-3xl text-center mb-10 w-full">Add New Module</h1>
          <div className="flex flex-col lg:flex-row gap-4">
            <AddModule courseId={params.id} />
            <div className="w-full h-full mt-10 md:mt-0">
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
        </Card>
      </div>
    </div>
  );
};

export default editCoursePage;
