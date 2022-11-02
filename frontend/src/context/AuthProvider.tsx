import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    let user: any = localStorage.getItem("user");
    if (user) {
      setAuth(JSON.parse(user));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
