import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";

export const useAuth = () => {
	const dispatch = useDispatch();

	const handleRegister = async ({ email, username, password }) => {
		try {
			dispatch(setLoading(true));
			const data = await register({ email, username, password });
		} catch (error) {
			dispatch(setError(error.response?.data?.message || "Register Failed"));
		} finally {
			dispatch(setLoading(false));
		}
	};

	const handleLogin = async ({ email, password }) => {
		try {
			dispatch(setLoading(true));
			const data = await login({ email, password });
			dispatch(setUser(data));
		} catch (error) {
			dispatch(setError(error.response?.data?.message || "Login Failed"));
		} finally {
			dispatch(setLoading(false));
		}
	};

	const handleGetMe = async () => {
		try {
			dispatch(setLoading(true));
			const data = await getMe();
			dispatch(setUser(data));
		} catch (error) {
			dispatch(setError(error.response?.data?.message || "Get Me Failed"));
		} finally {
			dispatch(setLoading(false));
		}
	};

	return {
		handleRegister,
		handleLogin,
		handleGetMe,
	};
};
