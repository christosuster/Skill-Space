"use client";

import { UploadButton } from "@/lib/uploadthing";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { addModule } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const AddModule = ({ courseId }: { courseId: string }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    // console.log("Form Submitted", formData);
    if (formData.moduleVideo == "") {
      toast({
        title: "Module must have a video!",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const res = await addModule({ ...formData, courseId });

    if (res.error) {
      toast({
        title: res.error,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Module created successfully!",
        variant: "success",
      });

      setFormData({
        moduleTitle: "",
        moduleDescription: "",
        moduleVideo: "",
      });

      setModuleVideo(null);
      setLoading(false);
      router.refresh();
    }
  };
  const [moduleVideo, setModuleVideo] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    moduleTitle: "",
    moduleDescription: "",
    moduleVideo: "",
  });

  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          handleSubmit();
        }}
        className=" flex flex-col gap-5 p-1"
      >
        <Input
          type="text"
          name="moduleTitle"
          placeholder="Module Title"
          className="w-full"
          value={formData.moduleTitle}
          onChange={(e) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              moduleTitle: e.target.value,
            }))
          }
          required
        />

        <Textarea
          name="moduleDescription"
          required
          placeholder="Module Description"
          className="w-full"
          value={formData.moduleDescription}
          onChange={(e) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              moduleDescription: e.target.value,
            }))
          }
        />

        {moduleVideo && (
          <div className="w-full flex flex-col justify-center items-center gap-2">
            <p className="text-green-500 ">Video Uploaded Successfully</p>
          </div>
        )}

        <div
          className={`${
            moduleVideo && "hidden"
          } ut-allowed-content:hidden flex justify-between items-center`}
        >
          <label htmlFor="moduleVideo" className="text-xl ">
            Upload Module Video
          </label>
          <UploadButton
            endpoint="videoUploader"
            onClientUploadComplete={(res) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                moduleVideo: res[0].url,
              }));
              setModuleVideo(res[0].url);
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Error uploading video! Please try again!",
                variant: "destructive",
              });

              console.log("Error: ", error.message);
            }}
          />
        </div>
        {loading ? (
          <Button disabled={loading}>
            <Loader2 className="animate-spin mr-2" />
            Creating Module
          </Button>
        ) : (
          <Button type="submit">Create Module</Button>
        )}
      </form>
    </div>
  );
};

export default AddModule;
