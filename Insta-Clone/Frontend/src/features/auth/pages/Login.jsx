import React, { useState } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
	const { user, loading, handleLogin } = useAuth();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		await handleLogin(username, password);

		navigate("/");
	};

	if (loading) {
		return (
			<main>
				<h1>Loading....</h1>
			</main>
		);
	}

	return (
		<main>
			<div className='form-container'>
				<h1>Login</h1>
				<form onSubmit={handleSubmit}>
					<input
						onInput={(e) => setUsername(e.target.value)}
						type='text'
						name='username'
						placeholder='Enter Username'
					/>
					<input
						onInput={(e) => setPassword(e.target.value)}
						type='password'
						name='password'
						placeholder='Enter Password'
					/>
					<button className='button primary-button' type='submit'>
						Login
					</button>
				</form>
				<p>
					Don't have an account?{" "}
					<Link className='toggleAuthForm' to='/register'>
						Register
					</Link>
				</p>
			</div>
		</main>
	);
};

export default Login;
