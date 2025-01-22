import { Alert, Button, Modal, Spinner, TextInput, Card } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { storage } from "../appwrite";
import {
  updateStart,
  updateError,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutSuccess,
} from "../store/store";

import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

function DashProfile() {
  // const user = useSelector((state) => state.user);
  // console.log(user);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUpdateSuccess, setImageUpdateSuccess] = useState("");
  const [imageUpdateError, setImageUpdateError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const username = useRef();
  const password = useRef();
  const email = useRef();
  const dispatch = useDispatch();
  // console.log(imageURL);

  const filePickerRef = useRef();

  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // console.log(file);

    if (file) {
      setImage(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (image) => {
    setIsUploading(true);
    try {
      setImageUploadError(null);
      const res = await storage.createFile(
        "67617c820013b8a60ec7",
        "unique()",
        image
      );

      // console.log(createFilePromise);
      // console.log(res);
      if (res && res.$id) {
        // console.log("inside if");
        const getFileURL = storage.getFileView("67617c820013b8a60ec7", res.$id);
        setImageURL(getFileURL);
      }
    } catch (error) {
      setImageUploadError(error.message);
      // console.log(imageURL);
    }
    setIsUploading(false);
  };

  useEffect(() => {
    if (image) {
      uploadImage(image);
    }
  }, [image]);

  const handleFormData = async (event) => {
    event.preventDefault();

    try {
      dispatch(updateStart());
      const res = await fetch(
        `http://localhost:3000/server/user/update/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
            profilePicture: imageURL || currentUser.profilePicture,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        dispatch(updateSuccess(data));
        setImageUpdateSuccess("User's Update Successfull");
      } else {
        dispatch(updateError(data));
        setImageUpdateError(data);
      }
    } catch (error) {
      // console.log(error.message);
      dispatch(updateError(error.message));
      setImageUpdateError(data);
    }
  };

  const handleDeleteUser = async () => {
    // console.log(currentUser._id);
    try {
      dispatch(deleteStart());
      const res = await fetch(
        `http://localhost:3000/server/user/delete/${currentUser._id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );

      const data = await res.json();
      // console.log(data);
      if (res.ok) {
        dispatch(deleteSuccess());
        navigate("/signIn");
      } else {
        dispatch(deleteFailure(data));
      }
    } catch (error) {
      // console.log(error.message);
      dispatch(deleteFailure(error.message));
    }
  };
  const handleSignOut = async (req, res) => {
    try {
      const res = await fetch("http://localhost:3000/server/user/sign-out", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signOutSuccess());
        navigate("/signin");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    dispatch(updateError(null));
    dispatch(deleteFailure(null));
  }, []);

  // console.log(imageURL);
  // console.log(currentUser.profilePicture);
  return (
    <div className=" pt-14 flex flex-grow flex-col items-center">
      <Card className="min-w-96">
        <h1 className="flex font-bold text-5xl justify-center pb-5">Profile</h1>
        <form className="pt-4 flex flex-col gap-3" onSubmit={handleFormData}>
          <input
            type="file"
            accept="images/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div className="flex justify-center cursor-pointer relative min-h-24 ">
            {isUploading && (
              <div className="absolute h-24 w-24 flex justify-center items-center">
                <Spinner
                  aria-label="Center-aligned spinner example"
                  size="xl"
                  color="warning"
                />
              </div>
            )}

            <img
              src={imageURL || currentUser.profilePicture}
              className={`rounded-full border-solid border-4 border-gray-500 h-24 w-24
              object-cover ${isUploading && "opacity-55"}`}
              onClick={() => filePickerRef.current.click()}
            />
          </div>
          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}
          <TextInput
            type="text"
            id="username"
            ref={username}
            placeholder="Username"
            defaultValue={currentUser.username}
          />
          <TextInput
            type="email"
            id="email"
            ref={email}
            placeholder="Email"
            defaultValue={currentUser.email}
          />
          <TextInput
            type="password"
            ref={password}
            id="password"
            placeholder="Enter password (Old or New if want to change)"
            required
          />
          <Button
            type="submit"
            outline
            disabled={imageUploadError || isUploading}
          >
            {currentUser.loading ? (
              <>
                <Spinner aria-label="Spinner button example" size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Update"
            )}
          </Button>
          {currentUser.isAdmin && (
            <Link to="/create-post">
              <Button type="button" color="success" className="w-full">
                create post
              </Button>
            </Link>
          )}
        </form>
        <div className="flex justify-between mt-2">
          <span
            className="text-red-400 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Delete Account
          </span>
          <span className="text-red-400 cursor-pointer" onClick={handleSignOut}>
            Sign Out
          </span>
        </div>
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => handleDeleteUser()}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <div className="pt-2">
          {imageUpdateError && (
            <Alert color="failure">{imageUpdateError}</Alert>
          )}

          {imageUpdateSuccess && (
            <Alert color="success">{imageUpdateSuccess}</Alert>
          )}
        </div>
      </Card>
    </div>
  );
}

export default DashProfile;
