import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
// import {
//   signInError,
//   signInSuccess,
//   signInStart,
// } from "../store/store";
// import { useDispatch, useSelector } from "react-redux";

function Signup() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // const dispatch = useDispatch();
  // const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // console.log("I am handleForm submit");
    // console.log(username.current.value);
    try {
      setLoading(true);
      setErrorMessage("");
      // dispatch(signInStart());
      const response = await fetch(
        "http://localhost:3000/server/auth/sign-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.current.value.trim(),
            email: email.current.value.trim(),
            password: password.current.value,
          }),
        }
      );

      const data = await response.json();
      // console.log(data.success);
      // console.log(data.message);
      // console.log(data);
      if (response.ok) {
        navigate("/signIn");
        // dispatch(signInSuccess(data));
      } else {
        setErrorMessage(data);
        // dispatch(signInError(data));
      }
      username.current.value = "";
      email.current.value = "";
      password.current.value = "";
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message);
      // dispatch(signInError(err.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col md:flex-row md:items-center max-w-3xl mx-auto gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold text-3xl">
            <span className="bg-green-700 px-3 py-1 rounded text-white">
              Pixel
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
            aliquid fugiat natus!
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
            <div>
              <Label htmlFor="username" value="Your Username" />
              <TextInput
                type="text"
                id="username"
                placeholder="Username"
                ref={username}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" value="Your Email" />
              <TextInput
                type="email"
                id="email"
                ref={email}
                placeholder="user@gmail.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" value="Your Password" />
              <TextInput
                type="password"
                id="password"
                placeholder="*********"
                ref={password}
                required
              />
            </div>
            <Button type="submit" color="success" disabled={loading}>
              {loading ? (
                <>
                  <Spinner aria-label="Spinner button example" size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
            <div className="text-sm">
              <span>Have an account?</span>
              <Link to="/signIn" className="text-blue-500 pl-3">
                Sign In
              </Link>
            </div>
            {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
