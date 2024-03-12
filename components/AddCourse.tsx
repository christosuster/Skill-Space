"use client";

import { UploadButton } from "@/lib/uploadthing";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { set } from "zod";
import { formDataType } from "@/lib/types";
import { addCourse } from "@/lib/actions";
import { error } from "console";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const AddCourse = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Form Submitted", formData);
    if (formData.courseImage == "") {
      toast({
        title: "You must upload a course image!",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const res = await addCourse(formData);

    if (res.error) {
      toast({
        title: res.error,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Course added successfully!",
        variant: "success",
      });

      router.push(`/myCourses/edit/${res.success?.id}`);
    }
  };
  const [courseImage, setCourseImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<formDataType>({
    courseTitle: "",
    courseDescription: "",
    courseImage: "",
  });

  return (
    <form
      action={handleSubmit}
      className="mx-auto w-full max-w-xl my-10 flex flex-col gap-5"
    >
      <Input
        type="text"
        name="courseTitle"
        placeholder="Course Title"
        className="w-full"
        value={formData.courseTitle}
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            courseTitle: e.target.value,
          }))
        }
        required
      />

      <Textarea
        name="courseDescription"
        required
        placeholder="Course Description"
        className="w-full"
        value={formData.courseDescription}
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            courseDescription: e.target.value,
          }))
        }
      />

      {courseImage && (
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <p className="text-green-500 ">Image Uploaded Successfully</p>
          <Image
            alt="Course Image"
            src={courseImage}
            width={200}
            height={200}
          />
        </div>
      )}

      <div
        className={`${
          courseImage && "hidden"
        } ut-allowed-content:hidden flex justify-between items-center`}
      >
        <label htmlFor="courseImage" className="text-xl ">
          Upload Course Image
        </label>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setCourseImage(res[0].url);
            setFormData((prevFormData) => ({
              ...prevFormData,
              courseImage: res[0].url,
            }));
          }}
          onUploadError={(error: Error) => {
            console.log("Error: ", error.message);
          }}
        />
      </div>
      {loading ? (
        <Button disabled={loading}>
          <Loader2 className="animate-spin mr-2" />
          Creating Course
        </Button>
      ) : (
        <Button type="submit">Create Course</Button>
      )}
    </form>
  );
};

export default AddCourse;
