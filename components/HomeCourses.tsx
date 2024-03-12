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

const courseData = [
  {
    title: "Introduction to Web Development",
    description:
      "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    imageUrl: "https://example.com/web-development.jpg",
    enrolledCandidates: 150,
    author: "John Doe",
  },
  {
    title: "Python Programming for Beginners",
    description: "Get started with Python programming language from scratch.",
    imageUrl: "https://example.com/python-programming.jpg",
    enrolledCandidates: 120,
    author: "Jane Smith",
  },
  {
    title: "Machine Learning Fundamentals",
    description:
      "An introduction to machine learning algorithms and techniques.",
    imageUrl: "https://example.com/machine-learning.jpg",
    enrolledCandidates: 80,
    author: "Alice Johnson",
  },
  {
    title: "Digital Marketing Essentials",
    description:
      "Learn the basics of digital marketing including SEO, SEM, and social media marketing.",
    imageUrl: "https://example.com/digital-marketing.jpg",
    enrolledCandidates: 200,
    author: "Bob Brown",
  },
];

const HomeCourses = () => {
  return (
    <div className="">
      <h1 className="text-3xl text-center">Latest Courses</h1>
      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {courseData.map((course) => (
          <Card
            key={course.title}
            className="w-full col-span-1 mx-auto hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
          >
            <Image
              src="/course1.jpg"
              alt="Course"
              className="w-full"
              height={200}
              width={300}
            />
            <CardHeader>
              <p className="text-muted-foreground text-sm">
                By {course.author}
              </p>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-foreground/80">{course.description}</h1>
            </CardContent>
            <CardFooter>
              <p className="font-bold">
                {course.enrolledCandidates} Candidates Enrolled
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeCourses;
