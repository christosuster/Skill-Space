import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { CalendarDays, User2Icon } from "lucide-react";
import Link from "next/link";

const HomeCourses = async () => {
  const latestCourses = await prisma.course.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      creator: true,
      students: true,
    },
  });

  return (
    <div className="">
      <h1 className="text-3xl text-center">Latest Courses</h1>
      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {latestCourses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <Card className="w-full col-span-1 mx-auto hover:shadow-xl transition duration-300 ease-in-out cursor-pointer flex flex-col h-full">
              <Image
                src={course.imageUrl}
                alt="Course"
                className="w-full object-cover aspect-video"
                height={200}
                width={300}
              />

              <CardHeader>
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
                <h1 className="text-foreground/80 overflow-hidden whitespace-nowrap text-ellipsis">
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
  );
};

export default HomeCourses;
