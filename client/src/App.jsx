import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/FooterComp";
import SetToTop from "./components/SetToTop";

function App() {
  // window.onbeforeunload = () => {
  //   localStorage.clear();
  // };
  return (
    <>
      <SetToTop />
      <Header />

      <Outlet />

      <Footer />
    </>
  );
}

export default App;
