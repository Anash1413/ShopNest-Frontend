import { useState } from "react";
import { AuthContext } from "./authContextObject";

export const AuthProvider = ({ children }) => {
  // 1. Initialize user directly from localStorage during the first render
  const [user, setuser] = useState(() => {
    const storeduserdata = localStorage.getItem("user");
    if (storeduserdata) {
      try {
        return JSON.parse(storeduserdata);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        return null;
      }
    }
    return null;
  });

  // 2. Initialize token directly from localStorage during the first render
  const [token, settoken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (userdata, usertoken) => {
    setuser(userdata);
    settoken(usertoken);
    localStorage.setItem("token", usertoken);
    localStorage.setItem("user", JSON.stringify(userdata));
  };

  const logout = () => {
    setuser(null);
    settoken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    isAdmin: user?.role === "admin", // 3. Safe optional chaining to prevent crashes when user is null
    isAuthentic: !!user,
    isVerified: user?.isVerified === true  ,
    login,
    logout,
  };

  // 4. No useEffect or 'loading' state required since state is immediately correct on mount!
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
