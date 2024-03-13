import AddCourse from "@/components/AddCourse";
import PageHeader from "@/components/PageHeader";
import React from "react";

const addCoursePage = () => {
  return (
    <div>
      <PageHeader text="Add Course" />
      <AddCourse />
    </div>
  );
};

export default addCoursePage;
