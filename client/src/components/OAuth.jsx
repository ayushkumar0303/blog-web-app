import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import { account } from "../appwrite";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInError, signInSuccess } from "../store/store";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOAuth = async () => {
    const auth = getAuth(app);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      // await account.createOAuth2Session(
      //   "google",
      //   "http://localhost:5173/dashboard",
      //   "http://localhost:5173/"
      // );
      // const resultsFromGoogle = await account.get();
      // console.log(resultsFromGoogle);

      const res = await fetch("http://localhost:3000/server/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          profilePicture: resultsFromGoogle.user.photoURL,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      // console.log(error);
      dispatch(signInError(error.message));
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleOAuth}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}

export default OAuth;
