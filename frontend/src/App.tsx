import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginSuccess from "./pages/LoginSuccess";
import Calendar from "./pages/Calendar";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Missing from "./pages/Missing";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/*public routes*/}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/success" element={<LoginSuccess />} />
              <Route path="/calendar" element={<Calendar />} />

              {/*we want to protect these routes*/}
              <Route element={<RequireAuth />}></Route>

              {/*catch all */}
              <Route path="*" element={<Missing />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
