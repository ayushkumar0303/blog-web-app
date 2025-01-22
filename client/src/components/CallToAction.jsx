import { Button } from "flowbite-react";
import React from "react";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-br-3xl rounded-tl-3xl mx-3">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to know more about sketching</h2>
        <p className="text-gray-500 my-2">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Exercitationem animi,
        </p>
        <Button className="">
          <a
            href="https://www.deviantart.com/adorkastock/gallery"
            rel="noopener norefer"
            target="_blank"
          >
            Learn more
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/32/Jesus_und_Ehebrecherin.jpg" />
      </div>
    </div>
  );
}

export default CallToAction;
