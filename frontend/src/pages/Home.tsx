import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <h1>Hello! It's Home page!</h1>
      <Link to="/login">Login</Link>
      <br />
      or
      <br />
      <Link to="/register">Register</Link>
    </>
  );
}

export default Home;
