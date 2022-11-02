import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { TUser } from "../types/User";
import axios from "axios";
import GoogleButton from "react-google-button";
import { Link } from "react-router-dom";

function Login() {
  const { auth, setAuth }: any = useAuth();

  console.log("login component: ", auth.user);

  const fetchAuthUser = async () => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": true,
      },
    };

    try {
      const response = await axios.get(
        "http://localhost:5000/auth/user",
        config
      );
      if (response && response.data) {
        console.log("You are authenticated! User: ", response.data);
        setAuth({ user: response.data });
        localStorage.setItem("user", JSON.stringify({ user: response.data }));
      }
    } catch (err) {
      console.log("Not properly authenticated", err);
    }
  };

  const redirectToGoogleSSO = async () => {
    let timer: NodeJS.Timeout | null = null;
    const googleLoginURL = "http://localhost:5000/auth/google";
    const newWindow = window.open(
      googleLoginURL,
      "_blank",
      "width=500,height=600"
    );
    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          fetchAuthUser();
          if (timer) clearInterval(timer);
        }
      }, 500);
    }
  };
  if (!auth.user) {
    return (
      <>
        <button>
          <GoogleButton onClick={redirectToGoogleSSO} />
        </button>
      </>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          alignItems: "center",
        }}
      >
        <h1>Hello {auth.user.username} You are in!</h1>
        <button className="btn" style={{ width: "50%" }}>
          <Link
            to="/calendar"
            style={{
              textDecoration: "none",
              color: "#fff",
              fontSize: "20px",
            }}
          >
            GO TO CALENDAR
          </Link>
        </button>
      </div>
    );
  }
}

export default Login;
