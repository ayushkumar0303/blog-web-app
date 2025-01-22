import { current } from "@reduxjs/toolkit";
import { Button, Card, Modal, Spinner, Table } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const postId = useRef();

  // console.log(userPosts);
  useEffect(() => {
    const getPosts = async () => {
      try {
        setPostsLoading(true);
        const res = await fetch(`http://localhost:3000/server/post/get-posts`);
        // console.log(res);
        const data = await res.json();
        // console.log(data.posts[0]);
        if (res.ok) {
          setUserPosts(data.posts);
          // console.log(data.posts.length);
          if (data.posts.length <= 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
      setPostsLoading(false);
    };

    if (currentUser.isAdmin) {
      getPosts();
    }
  }, [currentUser._id]);

  // console.log(posts);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `http://localhost:3000/server/post/get-posts?startIndex=${startIndex}`
      );

      const data = await res.json();
      // console.log(data);

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length <= 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log(postId.current);
  const handleDeletePost = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/server/post/delete-post/${postId.current}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      // console.log(data);
      // console.log(userPosts);
      if (res.ok) {
        setShowModal(false);
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postId.current)
        );
        // console.log(userPosts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="mx-auto py-5">
      {!postsLoading ? (
        <>
          {currentUser.isAdmin && userPosts.length > 0 ? (
            <>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Date updated</Table.HeadCell>
                  <Table.HeadCell>Post image</Table.HeadCell>
                  <Table.HeadCell>Post title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Edit</span>
                  </Table.HeadCell>
                </Table.Head>
                {userPosts.map((post) => (
                  <Table.Body className="divide-y" key={post._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/posts/${post.slug}`}>
                          <img
                            src={post.postImage}
                            alt={post.title}
                            className="w-20 h-10 object-cover bg-gray-500"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell className="max-w-[400px]">
                        <Link
                          to={`/posts/${post.slug}`}
                          className="line-clamp-1"
                        >
                          {post.slug}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            postId.current = post._id;
                          }}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-post/${post._id}`}>
                          <span className="text-teal-500 hover:underline">
                            Edit
                          </span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="text-cyan-400 w-full self-center text-sm py-7"
                >
                  Show more
                </button>
              )}
            </>
          ) : (
            <Card href="#" className="max-w-sm">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                There is no posts
              </h2>
            </Card>
          )}
        </>
      ) : (
        <div className="w-full flex justify-center items-center min-h-screen">
          <Spinner
            aria-label="Center-aligned spinner example"
            size="xl"
            color="warning"
          />
        </div>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeletePost()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashPosts;
