import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="home">
      <h3>Hello! Come in!</h3>
      <div className="buttonContainer">
        <button className="btn">
          <Link to="/login" style={{ textDecoration: "none", color: "#fff" }}>
            Login
          </Link>
        </button>
        <span style={{ fontSize: "20px", fontWeight: "normal" }}>or</span>
        <button className="btn">
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Register
          </Link>
        </button>
      </div>
    </section>
  );
}

export default Home;
