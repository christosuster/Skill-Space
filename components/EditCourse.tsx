"use client";

import { Session } from "next-auth";
import AddModule from "@/components/AddModule";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteCourse, deleteModule } from "@/lib/actions";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, TrashIcon } from "lucide-react";

type EditCourseProps = {
  session: Session;
  course: {
    id: string;
    creatorId: string;
    imageUrl: string;
    title: string;
    description: string;
    createdAt: Date;
    creator: {
      name: string;
    };
  };

  modules: {
    id: string;
    title: string;
    description: string | null;
    courseId: string;
    videoUrl: string;
  }[];
};

const EditCourse = (props: EditCourseProps) => {
  const { session, course, modules } = props;

  const [open, setOpen] = useState(false);
  const [openModuleDeleteConfirmation, setOpenModuleDeleteConfirmation] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingModuleDeletion, setLoadingModuleDeletion] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const router = useRouter();

  const confirmDelete = async () => {
    setLoading(true);
    const res = await deleteCourse(course.id);
    if (res.error) {
      toast({ title: res.error, variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({
      title: "Course Deleted!",
      variant: "success",
    });

    router.push("/created");
  };

  const confirmModuleDelete = async () => {
    setLoadingModuleDeletion(true);
    const res = await deleteModule(selectedModule!);
    if (res.error) {
      toast({ title: res.error, variant: "destructive" });
      setLoadingModuleDeletion(false);
      return;
    }
    toast({
      title: "Module Deleted!",
      variant: "success",
    });

    router.refresh();
    setLoadingModuleDeletion(false);
  };

  return (
    <div className="grid grid-cols-12  gap-4">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              course from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={openModuleDeleteConfirmation}
        onOpenChange={setOpenModuleDeleteConfirmation}
      >
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are deleting this module from the course. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmModuleDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
        {loading ? (
          <Button variant="destructive">
            <Loader2 className="animate-spin mr-2" /> Deleting
          </Button>
        ) : (
          <Button onClick={() => setOpen(true)} variant="destructive">
            Delete Course
          </Button>
        )}
      </div>

      <Card className="p-5 w-full col-span-12 md:col-span-6 lg:col-span-8">
        <h1 className="text-3xl text-center mb-10 w-full">Add New Module</h1>
        <div className="flex flex-col gap-4 overflow-hidden">
          <AddModule courseId={course.id} />
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
                  <div className="flex justify-center items-center">
                    {loadingModuleDeletion && selectedModule === module.id ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedModule(module.id);
                          setOpenModuleDeleteConfirmation(true);
                        }}
                        variant={"destructive"}
                        className="p-2"
                      >
                        <TrashIcon />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditCourse;
