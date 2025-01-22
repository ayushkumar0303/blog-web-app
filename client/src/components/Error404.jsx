import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className="min-h-screen flex mx-auto flex-col gap-2 items-center justify-center">
      <h1 className="font-bold text-8xl">404</h1>
      <h2 className="font-light text-4xl">Oops!</h2>
      <p className="text-lg text-red-600">Error 404 - Page Not Found</p>
      <p className="text-md text-gray-600">
        The page you requrested could not be found.
      </p>
      <Link to="/">
        <Button outline gradientDuoTone="purpleToBlue">
          Go to Home
        </Button>
      </Link>
    </div>
  );
}

export default Error404;
