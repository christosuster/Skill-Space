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

const HomeCourses = () => {
  return (
    <div className="">
      <h1 className="text-3xl text-center">Latest Courses</h1>
      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="w-full col-span-1 mx-auto">
          <Image src="/course1.jpg" alt="Course" width={350} height={200} />
          <CardHeader>
            <p className="text-muted-foreground text-sm">By John Doe</p>
            <CardTitle>Python for Data Science, AI & Development</CardTitle>
            <CardDescription>
              Learn Python - the most popular programming language and for Data
              Science and Software Development.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold">132 Candidates Enrolled</p>
          </CardContent>
        </Card>

        <Card className="w-full col-span-1 mx-auto">
          <Image
            src="/course1.jpg"
            alt="Course"
            className="w-full"
            height={200}
            width={300}
          />
          <CardHeader>
            <p className="text-muted-foreground text-sm">By John Doe</p>
            <CardTitle>Python for Data Science, AI & Development</CardTitle>
            <CardDescription>
              Learn Python - the most popular programming language and for Data
              Science and Software Development.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold">132 Candidates Enrolled</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeCourses;
