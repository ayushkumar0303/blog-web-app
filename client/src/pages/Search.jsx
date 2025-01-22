import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    category: "uncategorized",
    sort: "desc",
  });

  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermTab = urlParams.get("searchTerm");
    const sortTab = urlParams.get("sort");
    const categoryTab = urlParams.get("category");

    if (searchTermTab) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermTab,
        sort: sortTab,
        category: categoryTab,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `http://localhost:3000/server/post/get-posts?${searchQuery}`
      );
      const data = await res.json();

      if (res.ok) {
        setPosts(data.posts);
        setLoading(false);

        if (data.posts.length >= 9) {
          setSeeMore(true);
        } else {
          setSeeMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleShowMore = async () => {
    try {
      const startIndex = posts.length;
      // console.log(startIndex);
      const res = await fetch(
        `http://localhost:3000/server/post/get-posts?startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setPosts([...posts, ...data.posts]);
        if (data.posts.length >= 9) {
          setSeeMore(true);
        } else {
          setSeeMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleFormData = async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="min-h-screen flex ">
      <form
        className="min-h-screen flex flex-col w-1/4 gap-2 border-r border-gray-600 p-2 "
        onSubmit={handleFormData}
      >
        <div className="flex gap-2 items-center">
          <label htmlFor="searchTerm">Search Term:</label>
          <TextInput
            id="searchTerm"
            type="text"
            placeholder="Search..."
            value={sidebarData.searchTerm}
            onChange={(e) =>
              setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value,
              })
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="sort">Sort:</label>
          <Select
            onChange={(e) =>
              setSidebarData({ ...sidebarData, sort: e.target.value })
            }
            value={sidebarData.sort || "desc"}
            id="sort"
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="category">Category:</label>
          <Select
            onChange={(e) =>
              setSidebarData({
                ...sidebarData,
                category: e.target.value,
              })
            }
            value={sidebarData.category || "uncategorized"}
            id="category"
          >
            <option value="uncategorized">Uncategorized</option>
            <option value="next.js">Next.js</option>
            <option value="react.js">React.js</option>
            <option value="javascript">Javascript</option>
          </Select>
        </div>
        <div className="flex justify-center">
          <Button
            className="w-2/3"
            type="submit"
            outline
            gradientDuoTone="greenToBlue"
          >
            Apply Filters
          </Button>
        </div>
      </form>
      <div className="w-full">
        <h1 className="text-4xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Post results
        </h1>
        <div className="flex flex-wrap p-3 gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-center w-full font-medium text-2xl">No posts</p>
          )}
          {loading && <p className="text-center w-full italic">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => (
              <PostCard key={post._id} post={post}></PostCard>
            ))}
        </div>
        {seeMore && (
          <button
            onClick={handleShowMore}
            className="text-md italic text-green-600 w-full text-center p-5"
          >
            See more
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
