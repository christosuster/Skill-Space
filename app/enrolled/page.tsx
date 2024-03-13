import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import {
  ArrowRight,
  ArrowRightSquare,
  CalendarDays,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const enrolledPage = async () => {
  const session = await auth();

  const enrolledCourses = await prisma.enrollment.findMany({
    where: {
      studentId: session?.user?.id,
    },
    include: {
      course: {
        include: {
          creator: true,
          students: true,
        },
      },
      student: true,
    },
  });
  return (
    <div>
      <PageHeader text="Enrolled Courses" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolledCourses.map((course) => (
          <Card
            key={course.course.title}
            className="w-full col-span-1 mx-auto hover:shadow-xl transition duration-300 ease-in-out overflow-hidden flex flex-col"
          >
            <Image
              src={course.course.imageUrl}
              alt="Course"
              className="w-full aspect-video object-cover"
              height={200}
              width={300}
            />
            <CardHeader className="">
              <span className="flex items-center gap-1">
                <User2Icon size={18} />
                {course.course.creator.name}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={18} />
                {course.course.createdAt.toDateString()}
              </span>
              <CardTitle>{course.course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
              <h1 className="text-foreground/80">
                {course.course.description}
              </h1>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-3">
              <p className="font-bold">
                {course.course.students.length} Candidates Enrolled
              </p>

              <Link href={`/enrolled/${course.course.id}`}>
                <Button>
                  Go To Course <ArrowRight />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default enrolledPage;
