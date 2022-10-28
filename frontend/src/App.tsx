import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./App.css";

function App() {
  return (
    <div className="App">
      <button>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </button>
    </div>
  );
}

export default App;
