import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GrStatusGood } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashUsers() {
  const [getUsers, setGetUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userIdToDelete = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/server/user/get-users`, {
          credentials: "include",
        });
        // console.log(res);
        const data = await res.json();

        // console.log(data);

        if (res.ok) {
          setGetUsers(data.users);
        }
      } catch (error) {
        console.log(error.message);
      }
      setUsersLoading(false);
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, []);

  const handleDeleteUser = async () => {
    try {
      // console.log(userIdToDelete.current);
      const res = await fetch(
        `http://localhost:3000/server/user/delete/${userIdToDelete.current}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setShowModal(false);
        setGetUsers((prev) =>
          prev.filter((user) => user._id !== userIdToDelete.current)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="overflow-x-auto mx-auto py-5">
      {!usersLoading ? (
        <>
          {currentUser.isAdmin && getUsers.length > 0 ? (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>Profile</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {getUsers.map((user) => (
                <Table.Body className="divide-y" key={user._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="h-10 w-10 rounded-full object-cover bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${user._id}`}>{user.username}</Link>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? (
                        <GrStatusGood className="text-green-500" />
                      ) : (
                        <RxCross2 className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          // console.log(user._id);
                          userIdToDelete.current = user._id;
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
            <h1>No user found</h1>
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
    </div>
  );
}

export default DashUsers;
