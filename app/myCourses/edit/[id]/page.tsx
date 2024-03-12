import { auth } from "@/auth";
import EditCourse from "@/components/EditCourse";
import prisma from "@/lib/prisma";
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
  return (
    <div>
      <h1 className="mt-10 text-3xl text-center">Edit Course</h1>
      <EditCourse />
    </div>
  );
};

export default editCoursePage;
