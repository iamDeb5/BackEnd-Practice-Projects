import { useDispatch } from "react-redux";
import { register } from "../service/auth.api.js";
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
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleRegister };
};
