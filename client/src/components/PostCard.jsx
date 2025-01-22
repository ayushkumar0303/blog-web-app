import { Badge } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="group relative border p-2 rounded-lg flex flex-col w-[300px] h-[340px] gap-1 group-hover:border-9 overflow-hidden shadow-md ">
      <Link to={`/posts/${post.slug}`}>
        <img
          src={post.postImage}
          alt=""
          className="rounded-lg w-full h-[260px] object-cover group-hover:h-[200px] transition-all duration-300 group-hover:opacity-55"
        />
      </Link>
      <div className="flex flex-col items-start gap-1">
        <Link to={`/posts/${post.slug}`}>
          <h5 className="line-clamp-1">{post.title} </h5>
        </Link>
        <Badge className="text-sm italic">{post.category}</Badge>
        <Link
          to={`/posts/${post.slug}`}
          className="z-10 absolute bottom-[-200px] group-hover:bottom-0 left-0 text-center right-0 group-hover:border-2 group-hover:border-teal-500 hover:bg-teal-500 hover:text-white p-1 m-3 text-teal-500
          rounded-lg transition-all duration-300 text-sm"
        >
          Read more...
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
