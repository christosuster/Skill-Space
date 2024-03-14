import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { CalendarDays, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

const createdCoursesPage = async () => {
  noStore();
  const session = await auth();

  // (!session || !session.user) && redirect("/");

  const createdCourses = await prisma.course.findMany({
    where: {
      creatorId: session?.user?.id,
    },
    include: {
      creator: true,
      students: true,
    },
  });

  return (
    <div>
      <PageHeader text="Created Courses" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {createdCourses.map((course) => (
          <Card
            key={course.title}
            className="w-full col-span-1 mx-auto hover:shadow-xl transition duration-300 ease-in-out overflow-hidden flex flex-col"
          >
            <Image
              src={course.imageUrl}
              alt="Course"
              className="w-full aspect-video object-cover"
              height={200}
              width={300}
            />
            <CardHeader className="">
              <span className="flex items-center gap-1">
                <User2Icon size={18} />
                {course.creator.name}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={18} />
                {course.createdAt.toDateString()}
              </span>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
              <h1 className="text-foreground/80">{course.description}</h1>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-3">
              <p className="font-bold">
                {course.students.length} Candidates Enrolled
              </p>

              <Link href={`/created/${course.id}`}>
                <Button>Add Modules</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default createdCoursesPage;
