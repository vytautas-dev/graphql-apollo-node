import React, { useState } from "react";
import { TUser } from "../types/User";
import axios from "axios";
import GoogleButton from "react-google-button";

function Login() {
  const [user, setUser] = useState<TUser>();

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
        setUser(response.data);
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
  if (!user) {
    return (
      <>
        <button>
          <GoogleButton onClick={redirectToGoogleSSO} />
        </button>
      </>
    );
  } else {
    return <h1>Hello {user.username} You are in!</h1>;
  }
}

export default Login;
