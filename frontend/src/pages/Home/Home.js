import { useState, useRef, useEffect } from "react";
import Header from "../../components/header/Header";
import LeftHome from "../../components/home/left";
import { useSelector } from "react-redux";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import CreatePost from "../../components/createPost";
import SendVerification from "../../components/home/sendVerification";
import Post from "../../components/post";
import "./Home.css";

function Home({ setCreatePostVisible, posts }) {
  const { user } = useSelector((state) => ({ ...state }));
  const middle = useRef(null);
  const [height, setHeight] = useState();

  useEffect(() => {
    console.log(middle.current.clientHeight);
    setHeight(middle.current.clientHeight);
  }, []);

  return (
    <div className="home" style={{ height: `${height + 150}px` }}>
      <Header page="home" />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories />
        {user.verified === false && <SendVerification user={user} />}
        <CreatePost user={user} setCreatePostVisible={setCreatePostVisible} />
        <div className="posts">
          {posts.map((post) => (
            <Post post={post} key={posts._id} user={user} />
          ))}
        </div>
      </div>
      <RightHome user={user} />
    </div>
  );
}

export default Home;
