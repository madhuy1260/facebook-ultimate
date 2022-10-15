import React, { useReducer, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import axios from "axios";
import { profileReducer } from "../../functions/reducers";
import Header from "../../components/header/Header";
import Cover from "./Cover";
import ProfileMenu from "./ProfileMenu";
import ProfilePictureInfos from "./ProfilePictureInfos";
import PplYouMayKnow from "./PplYouMayKnow";
import CreatePost from "../../components/createPost";
import GridPosts from "./GridPosts";
import Post from "../../components/post";
import Photos from "./Photos";
import Friends from "./Friends";
import { Link } from "react-router-dom";
import Intro from "../../components/intro";
import { useMediaQuery } from "react-responsive";

function Profile({ setCreatePostVisible }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const [photos, setPhotos] = useState({});
  var userName = username === undefined ? user.username : username;
  // console.log(userName);

  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: {},
    error: "",
  });

  useEffect(() => {
    getProfile();
  }, [userName]);

  useEffect(() => {
    setOthername(profile?.details?.otherName);
  }, [profile]);
  var visitor = userName === user.username ? false : true;
  const [othername, setOthername] = useState();

  const path = `${userName}/*`;
  const max = 30;
  const sort = "desc";

  const getProfile = async () => {
    try {
      dispatch({ type: "PROFILE_REQUEST" });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (data.ok === false) {
        navigate("/profile");
      } else {
        try {
          const images = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/listImages`,
            { path, sort, max },
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          setPhotos(images.data);
        } catch (err) {
          console.log(err);
        }
        dispatch({ type: "PROFILE_SUCCESS", payload: data });
      }
    } catch (err) {
      dispatch({ type: "PROFILE_ERROR", payload: err.response.data.message });
    }
  };
  // console.log(profile);
  // console.log(photos);

  const profileTop = useRef(null);
  const [height, setHeight] = useState();
  const leftSide = useRef(null);
  const [leftHeight, setLeftHeight] = useState();
  const [scrollHeight, setScrollHeight] = useState();

  useEffect(() => {
    setHeight(profileTop.current.clientHeight + 300);
    setLeftHeight(leftSide.current.clientHeight + 300);
    window.addEventListener("scroll", getScroll, { passive: true });
    return () => {
      window.addEventListener("scroll", getScroll, { passive: true });
    };
  }, [loading, scrollHeight]);

  const check = useMediaQuery({
    query: "(min-width:901px)",
  });

  const getScroll = () => {
    setScrollHeight(window.pageYOffset);
  };

  return (
    <div className="profile">
      <Header page="profile" />
      <div className="profile_top" ref={profileTop}>
        <div className="profile_container">
          <Cover
            cover={profile.cover}
            visitor={visitor}
            photos={photos.resources}
          />
          <ProfilePictureInfos
            profile={profile}
            visitor={visitor}
            photos={photos.resources}
            othername={othername}
          />
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PplYouMayKnow />
            <div
              className={`profile_grid ${
                check && scrollHeight >= height && leftHeight > 1000
                  ? "scrollFixed showLess"
                  : check &&
                    scrollHeight >= height &&
                    leftHeight < 1000 &&
                    "scrollFixed showMore"
              }`}
            >
              <div className="profile_left" ref={leftSide}>
                <Intro
                  detailss={profile.details}
                  visitor={visitor}
                  setOthername={setOthername}
                />
                <Photos
                  username={userName}
                  token={user.token}
                  photos={photos}
                />
                <Friends friends={profile.friends} />
                <div className="relative_fb_copyright">
                  <Link to="/">Privacy </Link>
                  <span>. </span>
                  <Link to="/">Terms </Link>
                  <span>. </span>
                  <Link to="/">Advertisement </Link>
                  <span>. </span>
                  <Link to="/">
                    Ad Choices <i className="ad_choices_icon"> </i>{" "}
                  </Link>
                  <span>. </span>
                  <Link to="/">Cookies </Link>
                  <span>. </span>
                  <br />
                  <Link to="/">Meta © 2022</Link>
                  <span>. </span> <br />
                </div>
              </div>
              <div className="profile_right">
                {!visitor && (
                  <CreatePost
                    user={user}
                    profile
                    setCreatePostVisible={setCreatePostVisible}
                  />
                )}
                <GridPosts />
                <div className="posts">
                  {profile.posts && profile.posts.length ? (
                    profile.posts.map((post) => (
                      <Post post={post} user={user} key={post._id} profile />
                    ))
                  ) : (
                    <div className="no_posts">No Posts are available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
