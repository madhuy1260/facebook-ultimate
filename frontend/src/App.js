import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.js";
import Profile from "./pages/Profile/Profile.js";
import Home from "./pages/Home/Home.js";
import LoggedInRoutes from "./routes/LoggedInRoutes.js";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes.js";
import Activate from "./pages/Home/activate.js";
import Reset from "./pages/reset/index.js";
import CreatePostPopup from "./components/createPostPopup/index.js";
import { useSelector } from "react-redux";
import { useState, useReducer, useEffect } from "react";
import axios from "axios";

function reducer(state, action) {
  switch (action.type) {
    case "POSTS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "POSTS_SUCCESS":
      return { ...state, loading: false, error: "", posts: action.payload };
    case "POSTS_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function App() {
  const [createPostVisible, setCreatePostVisible] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const [{ loading, error, posts }, dispatch] = useReducer(reducer, {
    loading: false,
    posts: [],
    error: "",
  });

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    try {
      dispatch({ type: "POSTS_REQUEST" });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllPosts`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      dispatch({ type: "POSTS_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "POSTS_ERROR", payload: err.response.data.message });
    }
  };

  return (
    <div>
      {createPostVisible && (
        <CreatePostPopup
          user={user}
          setCreatePostVisible={setCreatePostVisible}
        />
      )}
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/"
            element={
              <Home setCreatePostVisible={setCreatePostVisible} posts={posts} />
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
          <Route path="/profile" element={<Profile />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} exact />
      </Routes>
    </div>
  );
}

export default App;
