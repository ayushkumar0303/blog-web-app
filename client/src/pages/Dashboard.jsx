import React, { useEffect, useState } from "react";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashboardCompo from "../components/DashboardComp";
import { useLocation } from "react-router-dom";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";

function Dashboard() {
  const [tab, setTab] = useState("");
  const location = useLocation();
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const tabFromUrl = urlSearchParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    // console.log(getTab);
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center md:items-start mb-4">
      <div className="">
        <DashSidebar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
      {tab === "dash" && <DashboardCompo />}
    </div>
  );
}

export default Dashboard;
