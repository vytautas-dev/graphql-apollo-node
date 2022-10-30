import React, { useEffect } from "react";

function LoginSuccess() {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return (
    <>
      <h1>Thank you for login</h1>
    </>
  );
}

export default LoginSuccess;
