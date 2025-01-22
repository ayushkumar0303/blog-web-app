import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { store, persistor } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemePage from "./components/ThemePage.jsx";
import PrivateDash from "./components/PrivateDash.jsx";
import Error404 from "./components/Error404.jsx";
import PrivateCreatePost from "./components/PrivateCreatePost.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";
import PostPage from "./pages/PostPage.jsx";
import Search from "./pages/Search.jsx";
import Projects from "./pages/Projects.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <PrivateDash />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
      {
        path: "/create-post",
        element: <PrivateCreatePost />,
        children: [
          {
            path: "/create-post",
            element: <CreatePost />,
          },
        ],
      },
      {
        path: "/update-post/:postId",
        element: <PrivateCreatePost />,
        children: [
          {
            path: "/update-post/:postId",
            element: <UpdatePost />,
          },
        ],
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      ,
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/posts/:postSlug",
        element: <PostPage />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
    ],
  },
  {
    path: "/*",
    element: <Error404 />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemePage>
          <RouterProvider router={router} />
        </ThemePage>
      </PersistGate>
    </Provider>
  </StrictMode>
);
