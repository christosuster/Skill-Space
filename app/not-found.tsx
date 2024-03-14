import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const notFoundPage = () => {
  return (
    <div className="text-center w-full h-[80vh] flex justify-center items-center p-4 flex-col">
      <h1 className="text-4xl text-red-500">Page Not Found!</h1>
      <Link href="/">
        <Button className="mt-4" variant="destructive">
          <ArrowLeft /> Go Home
        </Button>
      </Link>
    </div>
  );
};

export default notFoundPage;
