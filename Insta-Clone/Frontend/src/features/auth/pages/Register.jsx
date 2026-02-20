import React, { useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		axios
			.post(
				"http://localhost:3000/api/auth/register",
				{
					username,
					email,
					password,
				},
				{
					withCredentials: true,
				},
			)
			.then((response) => {
				console.log(response.data);
			});
	};

	return (
		<main>
			<div className='form-container'>
				<h1>Register</h1>
				<form onSubmit={handleSubmit}>
					<input
						onInput={(e) => {
							setUsername(e.target.value);
						}}
						type='text'
						name='username'
						placeholder='Enter Username'
					/>
					<input
						onInput={(e) => {
							setEmail(e.target.value);
						}}
						type='email'
						name='email'
						placeholder='Enter Email'
					/>
					<input
						onInput={(e) => {
							setPassword(e.target.value);
						}}
						type='password'
						name='password'
						placeholder='Enter Password'
					/>
					<button type='submit'>Register</button>
				</form>
				<p>
					Already have an account?{" "}
					<Link className='toggleAuthForm' to='/login'>
						Login
					</Link>
				</p>
			</div>
		</main>
	);
};

export default Register;
