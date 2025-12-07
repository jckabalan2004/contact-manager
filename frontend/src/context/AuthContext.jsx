import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api("/auth/me");
      setUser(res.user || null);
    } catch {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setUser(res.user);
      navigate("/dashboard");
    } catch (err) {
      return { success: false, message: err.message };
    }
    return { success: true };
  };

  const register = async (data) => {
    try {
      const res = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setUser(res.user);
      navigate("/dashboard");
    } catch (err) {
      return { success: false, message: err.message };
    }
    return { success: true };
  };

  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, checkingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
