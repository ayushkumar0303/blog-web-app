import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storage } from "../appwrite";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formsubmittionError, setFormsubmittionError] = useState(null);
  const [formData, setFormData] = useState({});

  const { postId } = useParams();
  // console.log(postId);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        setPostLoading(true);
        const res = await fetch(
          `http://localhost:3000/server/post/get-posts?postId=${postId}`
        );
        const data = await res.json();
        // console.log(data.posts[0]);

        if (res.ok) {
          setFormsubmittionError(null);
          setFormData(data.posts[0]);
        } else {
          setFormsubmittionError(data);
        }
        setPostLoading(false);
        // console.log(formData);
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleFormData = async (event) => {
    event.preventDefault();
    try {
      setFormsubmittionError(null);
      const res = await fetch(
        `http://localhost:3000/server/post//update-post/${formData._id}/${formData.userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      // console.log(data);
      if (res.ok) {
        navigate(`/posts/${data.slug}`);
      } else {
        setFormsubmittionError(data);
        // console.log(data);
      }
    } catch (error) {
      // console.log(error.message);
      setFormsubmittionError(error.message);
    }
  };
  const handleUploadImage = async () => {
    setImageUploading(true);
    try {
      setImageUploadError(null);
      const res = await storage.createFile(
        "67617c820013b8a60ec7",
        "unique()",
        image
      );
      if (res && res.$id) {
        const getFileURL = storage.getFileView("67617c820013b8a60ec7", res.$id);
        // setImageUrl(getFileURL);
        setFormData({ ...formData, postImage: getFileURL });
        // console.log(formData);
      }
    } catch (error) {
      // console.log(error.message);
      setImageUploadError(error.message);
    }
    setImageUploading(false);
  };

  // console.log(imageUrl);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // console.log(file);
    if (file) {
      setImage(file);
      // setImageUrl(URL.createObjectURL(file));
    }
  };
  // console.log(image);
  // console.log(imageUrl);
  // console.log(formData);
  // console.log(formData);
  return (
    <>
      {postLoading ? (
        <div className="w-full flex justify-center items-center min-h-screen">
          <Spinner
            aria-label="Center-aligned spinner example"
            size="xl"
            color="warning"
          />
        </div>
      ) : (
        <div className="p-3 min-h-screen max-w-3xl mx-auto">
          <h1 className="font-bold text-3xl text-center my-4">Update a Post</h1>
          <form className="flex flex-col gap-4" onSubmit={handleFormData}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <TextInput
                type="text"
                placeholder="Title"
                required
                className="flex-1"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                value={formData.title}
              />
              <Select
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                value={formData.category}
              >
                <option value="uncategorized">Select a category</option>
                <option value="javascript">JavaScript</option>
                <option value="react.js">React.js</option>
                <option value="next.js">Next.js</option>
              </Select>
            </div>
            <div className="border-teal-500 border-4 p-3 border-dotted flex gap-4 justify-between">
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                size="sm"
                outline
                onClick={handleUploadImage}
                disabled={imageUploading}
              >
                Upload image
              </Button>
            </div>
            {imageUploadError && (
              <Alert color="failure">{imageUploadError}</Alert>
            )}
            {imageUploading && (
              <div className="w-full h-24 flex justify-center items-center">
                <Spinner
                  aria-label="Center-aligned spinner example"
                  size="xl"
                  color="warning"
                />
              </div>
            )}
            {!imageUploading && formData.postImage && (
              <img
                src={formData.postImage}
                alt=""
                className="h-80 object-cover"
              />
            )}

            <ReactQuill
              theme="snow"
              placeholder="Write something..."
              className="h-72 mb-12 dark:text-white"
              onChange={(value) => setFormData({ ...formData, content: value })}
              value={formData.content}
              required
            />
            <Button type="submit" color="success" disabled={imageUploading}>
              Publish
            </Button>
          </form>
          {formsubmittionError && (
            <Alert className="mt-4 mb-4" color="failure">
              {formsubmittionError}
            </Alert>
          )}
        </div>
      )}
    </>
  );
}

export default UpdatePost;
