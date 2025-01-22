import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiTable,
  HiDocument,
  HiArrowSmRight,
  HiUsers,
  HiAnnotation,
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOutSuccess } from "../store/store";
import { useDispatch, useSelector } from "react-redux";

function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const tabFromUrl = urlSearchParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    // console.log(getTab);
  }, [location.search]);

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
  return (
    <Sidebar className="">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col">
          <Link to="/dashboard/?tab=profile">
            <Sidebar.Item
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              active={tab === "profile"}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard/?tab=dash">
                <Sidebar.Item
                  icon={HiDocument}
                  labelColor="dark"
                  active={tab === "dash"}
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard/?tab=posts">
                <Sidebar.Item
                  icon={HiDocument}
                  labelColor="dark"
                  active={tab === "posts"}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard/?tab=users">
                <Sidebar.Item
                  icon={HiUsers}
                  labelColor="dark"
                  active={tab === "users"}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard/?tab=comments">
                <Sidebar.Item
                  icon={HiAnnotation}
                  labelColor="dark"
                  active={tab === "comments"}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Sidebar.Item
            className="cursor-pointer"
            icon={HiArrowSmRight}
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
