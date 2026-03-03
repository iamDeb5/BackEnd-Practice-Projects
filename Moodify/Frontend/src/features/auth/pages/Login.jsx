import React, { useState } from "react";
import "../styles/login.scss";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  };

  return (
    <main className="login-page">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <FormGroup
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            label="Email"
            placeholder="Email"
          />
          <FormGroup
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            label="Password"
            placeholder="Password"
          />
          <button className="button" type="submit">
            Login
          </button>
        </form>
        <p className="toggleAuth">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
