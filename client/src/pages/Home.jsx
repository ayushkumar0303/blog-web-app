import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/server/post/get-posts?limit=9`
        );
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getPosts();
  }, [currentUser && currentUser._id]);
  return (
    <div className="px-4">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ab
          repellendus perferendis voluptatibus, temporibus iste unde, quam,
          commodi modi deleniti voluptate doloremque nostrum esse neque velit!
          Nobis minima sapiente officia!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto flex flex-col p-3 items-center gap-8 py-7">
        <h1 className="text-lg">Recent articles</h1>
        <div className="flex gap-4 flex-wrap w-full justify-center">
          {posts.map((post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </div>
        <Link to="/search" className="hover:underline text-lg text-teal-500">
          View all posts
        </Link>
      </div>
    </div>
  );
}

export default Home;
