import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Register failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await login({ username, email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (err) {
      // Not logged in or backend unavailable — silently continue
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleGetMe,
    handleLogout,
  };
};
