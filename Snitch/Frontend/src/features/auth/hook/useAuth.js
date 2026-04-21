import { useDispatch } from "react-redux";
import { register, login } from "../service/auth.api.js";
import { setLoading, setError, setUser } from "../state/auth.slice.js";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({
    email,
    contact,
    password,
    fullName,
    isSeller = false,
  }) => {
    try {
      dispatch(setLoading(true));
      const data = await register({
        email,
        contact,
        password,
        fullName,
        isSeller,
      });
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message;
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message;
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleRegister, handleLogin };
};
