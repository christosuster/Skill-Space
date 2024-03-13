import React from "react";

const PageHeader = ({ text }: { text: string }) => {
  return (
    <div className="pageHeader py-10 text-5xl text-center bg-accent text-accent-foreground uppercase mb-10">
      <h1>{text}</h1>
    </div>
  );
};

export default PageHeader;
