import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GrStatusGood } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashComments() {
  const [getComments, setGetComments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const commentIdToDelete = useRef();

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/server/comment/get-all-comments`,
          {
            credentials: "include",
          }
        );
        // console.log(res);
        const data = await res.json();

        // console.log(data);

        if (res.ok) {
          setGetComments(data.comments);
        }
      } catch (error) {
        console.log(error.message);
      }
      setCommentsLoading(false);
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, []);

  const handleDeleteComment = async () => {
    try {
      // console.log(userIdToDelete.current);
      const res = await fetch(
        `http://localhost:3000/server/comment/delete-comment/${commentIdToDelete.current}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setShowModal(false);
        setGetComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete.current)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log(getComments);
  return (
    <div className="overflow-x-auto mx-auto py-5 ">
      {!commentsLoading ? (
        <>
          {currentUser.isAdmin && (getComments && getComments.length) > 0 ? (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>Content</Table.HeadCell>
                <Table.HeadCell>No. of likes</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {getComments.map((comment) => (
                <Table.Body className="divide-y" key={comment._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className=" max-w-[200px]">
                      <Link to={`/`}></Link>
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell>{comment.likesCount}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          // console.log(user._id);
                          commentIdToDelete.current = comment._id;
                        }}
                        className="text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          ) : (
            <h1>No comments yet!</h1>
          )}
        </>
      ) : (
        <h1>Loading...</h1>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteComment()}>
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

export default DashComments;
