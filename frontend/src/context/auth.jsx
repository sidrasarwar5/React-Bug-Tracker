import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../api/user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    const { token: newToken, userId, name, email: userEmail, user_type } = data.data;

    const userObj = { userId, name, email: userEmail, user_type };

    setToken(newToken);
    setUser(userObj);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userObj));
    return data;
  };

  const signup = async (name, email, password, user_type, phone) => {
    const data = await signupUser(name, email, password, user_type, phone);
    const {
      token: newToken,
      userId,
      name: userName,
      email: userEmail,
      user_type: role,
    } = data.data;

    const userObj = { userId, name: userName, email: userEmail, user_type: role };

    setToken(newToken);
    setUser(userObj);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userObj));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}