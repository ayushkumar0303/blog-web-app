import React from "react";
import CallToAction from "../components/CallToAction";

function Projects() {
  return (
    <div className="min-h-screen max-w-3xl flex-col flex justify-center items-center mx-auto gap-6 p-3">
      <h1 className="font-semibold text-3xl text-center">Projects</h1>
      <p className="text-gray-500 text-md">
        Lorem, ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet,
        consectetur adipisicing elit.
      </p>

      <CallToAction />
    </div>
  );
}

export default Projects;
