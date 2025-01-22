import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInError, signInSuccess, signInStart } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

function Signin() {
  const email = useRef();
  const password = useRef();

  const navigate = useNavigate();

  // const [errorMessage, setErrorMessage] = useState("");
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // console.log("I am handleForm submit");
    // console.log(username.current.value);
    try {
      // setLoading(true);
      // setErrorMessage("");
      dispatch(signInStart());
      const response = await fetch(
        "http://localhost:3000/server/auth/sign-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
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
        navigate("/");
        dispatch(signInSuccess(data));
      } else {
        // setErrorMessage(data);
        dispatch(signInError(data));
      }
      email.current.value = "";
      password.current.value = "";
      // setLoading(false);
    } catch (err) {
      // setLoading(false);
      // setErrorMessage(err.message);
      dispatch(signInError(err.message));
      // console.log(false);
    }
  };

  useEffect(() => {
    dispatch(signInError(null));
  }, []);
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
                "Sign In"
              )}
            </Button>
            <OAuth />
            <div className="text-sm">
              <span>Don't have account?</span>
              <Link to="/signUp" className="text-blue-500 pl-3">
                Sign Up
              </Link>
            </div>
            {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
