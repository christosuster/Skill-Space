import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, User2Icon } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

const allCoursesPage = async () => {
  noStore();
  const courses = await prisma.course.findMany({
    include: {
      creator: true,
      students: true,
    },
  });

  return (
    <div>
      <PageHeader text="All Courses" />
      <div className="">
        <div className="my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id}>
              <Card className="w-full col-span-1 mx-auto hover:shadow-xl transition duration-300 ease-in-out flex flex-col h-full">
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
                  <h1 className="text-foreground/80 whitespace-nowrap overflow-hidden text-ellipsis">
                    {course.description}
                  </h1>
                </CardContent>
                <CardFooter>
                  <p className="font-bold">
                    {course.students.length} Candidates Enrolled
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default allCoursesPage;
