import { auth } from "@/auth";
import AddModule from "@/components/AddModule";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
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
      <div className="grid grid-cols-12  gap-4">
        <div className="w-full col-span-12 md:col-span-6 lg:col-span-4 ">
          <Image
            src={course.imageUrl}
            alt="Course Picture"
            width={1000}
            height={300}
            className="w-full shadow-md aspect-video object-cover rounded-lg"
          />
          <div className="py-5 flex flex-col gap-4">
            <div className="grid grid-cols-3 text-xl gap-4 items-center">
              <h1 className="col-span-1 text-accent-foreground font-semibold">
                Title
              </h1>
              <h1 className="col-span-2">{course.title}</h1>
            </div>
            <div className="grid grid-cols-3 text-xl gap-4 items-center ">
              <h1 className="col-span-1 text-accent-foreground font-semibold">
                Description
              </h1>
              <h1 className="col-span-2">{course.description}</h1>
            </div>
            <div className="grid grid-cols-3 text-xl gap-4 items-center">
              <h1 className="col-span-1 text-accent-foreground font-semibold">
                Author
              </h1>
              <h1 className="col-span-2">{course.creator.name}</h1>
            </div>
            <div className="grid grid-cols-3 text-xl gap-4 items-center">
              <h1 className="col-span-1 text-accent-foreground font-semibold">
                Created On
              </h1>
              <h1 className="col-span-2">{course.createdAt.toDateString()}</h1>
            </div>
          </div>
        </div>

        <Card className="p-5 w-full col-span-12 md:col-span-6 lg:col-span-8">
          <h1 className="text-3xl text-center mb-10 w-full">Add New Module</h1>
          <div className="flex flex-col lg:flex-row gap-4 overflow-hidden">
            <AddModule courseId={params.id} />
            <div className="w-full h-full max-h-96 overflow-y-auto mt-10 md:mt-0 flex flex-col gap-2">
              {modules.map((module, idx) => {
                return (
                  <div
                    key={module.id}
                    className="border border-border flex p-3 rounded-xl gap-2 hover:shadow-lg transition-all"
                  >
                    <div className=" w-12 flex justify-center items-center">
                      <h1 className="text-2xl">{idx}</h1>
                    </div>
                    <div className="text-left flex-1">
                      <h1 className="text-xl font-bold">{module.title}</h1>
                      <h1>{module.description}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default editCoursePage;
