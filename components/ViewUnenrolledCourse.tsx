"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { enroll } from "@/lib/actions";
import { useRouter } from "next/navigation";

type ViewCourseProps = {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
    creatorId: string;
    creator: {
      name: string;
    };
  };
  modules: moduleType[];
  enrolled: {
    id: string;
    studentId: string;
    courseId: string;
  } | null;
};

type moduleType = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  courseId: string;
};

const ViewUnenrolledCourse = ({
  course,
  modules,
  enrolled,
}: ViewCourseProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleModuleClick = (module: moduleType) => {
    if (!enrolled) {
      toast({
        title: "You need to enroll to view the module",
        variant: "destructive",
      });
      return;
    }

    router.push(`/enrolled/${course.id}`);
  };

  const handleEnrollment = async (courseId: string) => {
    setLoading(true);
    const res = await enroll(courseId);
    if (res.error) {
      toast({ title: res.error, variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({ title: "Enrolled Successfully", variant: "success" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="grid grid-cols-12  gap-4">
      <div className="w-full col-span-12 md:col-span-6 lg:col-span-4 ">
        <Image
          src={course.imageUrl}
          alt="Course Picture"
          width={1000}
          height={300}
          className="w-full aspect-video object-cover rounded-lg shadow-xl"
        />
        <div className="py-5 flex flex-col gap-4 ">
          <div className="grid leading-5 grid-cols-3 text-xl gap-4 items-center">
            <h1 className="col-span-1 text-accent-foreground font-semibold">
              Title
            </h1>
            <h1 className="col-span-2">{course.title}</h1>
          </div>
          <div className="grid leading-5 grid-cols-3 text-xl gap-4 items-center ">
            <h1 className="col-span-1 text-accent-foreground font-semibold">
              Description
            </h1>
            <h1 className="col-span-2">{course.description}</h1>
          </div>
          <div className="grid leading-5 grid-cols-3 text-xl gap-4 items-center">
            <h1 className="col-span-1 text-accent-foreground font-semibold">
              Author
            </h1>
            <h1 className="col-span-2">{course.creator.name}</h1>
          </div>
          <div className="grid leading-5 grid-cols-3 text-xl gap-4 items-center">
            <h1 className="col-span-1 text-accent-foreground font-semibold">
              Created On
            </h1>
            <h1 className="col-span-2">{course.createdAt.toDateString()}</h1>
          </div>
          {loading ? (
            <Button>Enrolling...</Button>
          ) : (
            <Button
              disabled={!!enrolled}
              onClick={() => handleEnrollment(course.id)}
            >
              {enrolled ? "Enrolled" : "Enroll"}
            </Button>
          )}
        </div>
      </div>

      <Card className=" w-full col-span-12 md:col-span-6 lg:col-span-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Modules
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden h-96">
          <div className=" flex flex-col gap-2">
            {modules.map((module, idx) => {
              return (
                <div
                  onClick={() => handleModuleClick(module)}
                  key={module.id}
                  className={`border border-border flex p-3 rounded-xl gap-2 hover:shadow-md hover:bg-accent transition-all cursor-pointer`}
                >
                  <div className=" w-12 flex justify-center items-center">
                    <h1 className="text-2xl">{idx}</h1>
                  </div>
                  <div className="text-left flex-1 flex">
                    <div className="flex-1">
                      <h1 className="text-xl ">{module.title}</h1>
                      <h1 className="text-sm">{module.description}</h1>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewUnenrolledCourse;
