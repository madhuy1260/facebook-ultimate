import React, { useReducer, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import axios from "axios";
import { profileReducer } from "../../functions/reducers";
import Header from "../../components/header/Header";
import Cover from "./Cover";
import ProfileMenu from "./ProfileMenu";
import ProfilePictureInfos from "./ProfilePictureInfos";

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  var userName = username === undefined ? user.username : username;

  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: {},
    error: "",
  });

  useEffect(() => {
    getProfile();
  }, [userName]);

  const getProfile = async () => {
    try {
      dispatch({ type: "PROFILE_REQUEST" });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${username}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (data.ok === false) {
        navigate("/profile");
      } else {
        dispatch({ type: "PROFILE_SUCCESS", payload: data });
      }
    } catch (err) {
      dispatch({ type: "PROFILE_ERROR", payload: err.response.data.message });
    }
  };
  // console.log(profile);

  return (
    <div className="profile">
      <Header page="profile" />
      <div className="profile_top">
        <div className="profile_container">
          <Cover cover={profile.cover} />
          <ProfilePictureInfos profile={profile} />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}

export default Profile;
