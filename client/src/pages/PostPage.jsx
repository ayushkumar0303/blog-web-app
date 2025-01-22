import { Badge } from "flowbite-react";
import React, { useEffect, useState } from "react";
// import { Parser } from "html-react-parser";
import { useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostComment from "../components/PostComment";
import { HiMenuAlt1 } from "react-icons/hi";

function PostPage() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);

  // console.log(post);
  useEffect(() => {
    const makeAbsoluteUrl = (content) => {
      const baseUrl = "https://";
      return content.replace(/<a\s+href="(?!https?)([^"]+)"/g, (match, url) => {
        return `<a href="${baseUrl}${url}"`;
      });
    };
    try {
      const fetchPost = async () => {
        setPageLoading(true);
        const res = await fetch(
          `http://localhost:3000/server/post/get-posts?slug=${postSlug}`
        );
        const data = await res.json();
        // console.log(data.posts[0].content);

        if (res.ok) {
          const updatedContent = makeAbsoluteUrl(data.posts[0].content);
          setPost({ ...data.posts[0], content: updatedContent });
        }
        setPageLoading(false);
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postSlug]);

  return (
    <main className="flex flex-col items-center my-4 gap-5 w-full min-h-screen">
      {pageLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="font-serif text-center text-3xl lg:text-4xl max-w-2xl p-3">
            {post && post.title.charAt(0).toUpperCase() + post.title.slice(1)}
          </div>
          <Badge color="gray" className="">
            {post && post.category}
          </Badge>
          <div className="border-b-2 border-slate-300 w-2/3 flex flex-col min-w-6xl">
            <img
              src={post && post.postImage}
              alt=""
              className="w-full h-[450px] object-cover self-center "
            />
            <div className="flex justify-between my-2 text-xs">
              <span>
                {new Date(post && post.updatedAt).toLocaleDateString()}
              </span>
              <span className="italic">{`${
                post && parseInt(post.content.length / 1000)
              } mins read `}</span>
            </div>
          </div>
          <div
            className="content_class p-3 mx-auto max-w-4xl"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
          <div className="max-w-4xl mx-auto w-full">
            <CallToAction />
          </div>

          <PostComment postId={post && post._id} />
        </>
      )}
    </main>
  );
}
export default PostPage;
