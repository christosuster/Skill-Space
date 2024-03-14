import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const HomeHeader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 py-10">
      <div className="col-span-1 flex flex-col justify-center items-start gap-8">
        <h1 className="text-7xl ">Learn without limits</h1>
        <p className="text-2xl leading-6 tracking-wider font-ligh">
          Start, switch, or advance your career with more than 6,900 courses,
          Professional Certificates, and degrees from world-class universities
          and companies.
        </p>
        <Link href={"/courses"}>
          <Button className="h-16 w-52" variant={"default"}>
            Join for Free
          </Button>
        </Link>
      </div>
      <div className="col-span-1 ml-auto hidden sm:block">
        <Image src="/headerPic.png" alt="hero" width={500} height={500} />
      </div>
    </div>
  );
};

export default HomeHeader;
