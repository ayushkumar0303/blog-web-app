import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import {
  HiAnnotation,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { HiArrowNarrowUp } from "react-icons/hi";
import { Link } from "react-router-dom";

function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [oneMonthAgoUsers, setOneMonthAgoUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [oneMonthAgoPosts, setOneMonthAgoPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [oneMonthAgoComments, setOneMonthAgoComments] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    try {
      const fetchPosts = async () => {
        setPageLoading(true);
        const res = await fetch(
          `http://localhost:3000/server/post/get-posts?limit=5`
        );
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setOneMonthAgoPosts(data.lastMonthPosts);
          // console.log(data);
        }
        setPageLoading(false);
      };
      const fetchUsers = async () => {
        setPageLoading(true);
        const res = await fetch(
          `http://localhost:3000/server/user/get-users?limit=5`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setOneMonthAgoUsers(data.oneMonthAgoUsers);
        }
        setPageLoading(false);
      };
      const fetchComments = async () => {
        setPageLoading(true);
        const res = await fetch(
          `http://localhost:3000/server/comment/get-all-comments?limit=5`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setOneMonthAgoComments(data.oneMonthAgoComments);
        }
        setPageLoading(false);
      };

      fetchComments();
      fetchPosts();
      fetchUsers();
    } catch (error) {
      console.log(error.message);
    }
  }, [currentUser]);

  // console.log(oneMonthAgoPosts);
  return (
    <div className="p-3 md:mx-auto">
      {pageLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col p-3 dark:slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 uppercase text-md">
                    Total Users
                  </h3>
                  <p className="text-2xl">{totalUsers}</p>
                </div>
                <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-green-400 flex items-center">
                  <HiArrowNarrowUp />
                  {oneMonthAgoUsers}
                </span>
                <div>Last Month</div>
              </div>
            </div>
            <div className="flex flex-col p-3 dark:slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 uppercase text-md">
                    Total Post
                  </h3>
                  <p className="text-2xl">{totalPosts}</p>
                </div>
                <HiDocumentText className="bg-yellow-600 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-green-400 flex items-center">
                  <HiArrowNarrowUp />
                  {oneMonthAgoPosts}
                </span>
                <div>Last Month</div>
              </div>
            </div>
            <div className="flex flex-col p-3 dark:slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 uppercase text-md">
                    Total Comments
                  </h3>
                  <p className="text-2xl">{totalComments}</p>
                </div>
                <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-green-400 flex items-center">
                  <HiArrowNarrowUp />
                  {oneMonthAgoComments}
                </span>
                <div>Last Month</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
            <div className="flex flex-col w-full md:w-auto p-2 rounded-md dark:bg-gray-800 shadow-md">
              <div className="flex justify-between p-3 text-sm font-semibold">
                <p className="text-center p-2">Recent users</p>
                <Link to="/dashboard?tab=users">
                  <Button outline gradientDuoTone="redToYellow">
                    See all
                  </Button>
                </Link>
              </div>
              <div>
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Profile</Table.HeadCell>
                    <Table.HeadCell>Username</Table.HeadCell>
                  </Table.Head>
                  {users.map((user) => (
                    <Table.Body className="divide-y" key={user._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
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
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
            </div>
            <div className="flex flex-col w-full md:w-auto p-2 rounded-md dark:bg-gray-800 shadow-md">
              <div className="flex justify-between p-3 text-sm font-semibold">
                <p className="text-center p-2">Recent comments</p>
                <Link to="/dashboard?tab=comments">
                  <Button outline gradientDuoTone="redToYellow">
                    See all
                  </Button>
                </Link>
              </div>
              <div>
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Content</Table.HeadCell>
                    <Table.HeadCell>No. of likes</Table.HeadCell>
                  </Table.Head>
                  {comments.map((comment) => (
                    <Table.Body className="divide-y" key={comment._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className=" w-96">
                          <p className="line-clamp-2">{comment.content}</p>
                        </Table.Cell>
                        <Table.Cell>{comment.likesCount}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
            </div>

            <div className="flex flex-col w-full md:w-auto p-2 rounded-md dark:bg-gray-800 shadow-md">
              <div className="flex justify-between p-3 text-sm font-semibold">
                <p className="text-center p-2">Recent posts</p>
                <Link to="/dashboard?tab=posts">
                  <Button outline gradientDuoTone="redToYellow">
                    See all
                  </Button>
                </Link>
              </div>
              <div>
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Post image</Table.HeadCell>
                    <Table.HeadCell>Post title</Table.HeadCell>
                    <Table.HeadCell>Category</Table.HeadCell>
                  </Table.Head>
                  {posts.map((post) => (
                    <Table.Body className="divide-y" key={post._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                          <Link to={`/posts/${post.slug}`}>
                            <img
                              src={post.postImage}
                              alt={post.title}
                              className="w-20 h-10 object-cover bg-gray-500"
                            />
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <Link to={`/posts/${post.slug}`}>{post.slug}</Link>
                        </Table.Cell>
                        <Table.Cell>{post.category}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardComp;
