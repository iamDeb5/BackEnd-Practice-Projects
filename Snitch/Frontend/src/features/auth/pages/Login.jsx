import React, { useState } from "react";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
      console.log("Login Form Data:", formData);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#0e0e0e] text-[#e5e2e1] flex flex-col lg:flex-row font-sans">
      {/* Left Panel - Image Area (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#131313] items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
          alt="Fashion Experience"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent"></div>

        {/* Seamless blend gradient on the right edge */}
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#0e0e0e] to-transparent z-10 pointer-events-none"></div>

        <div className="absolute bottom-16 left-12 lg:bottom-20 lg:left-20 max-w-lg z-20">
          <div className="w-16 h-1 bg-[#ffc107] mb-5 rounded-full"></div>
          <h2 className="text-5xl lg:text-6xl font-light mb-5 text-white leading-tight">
            Welcome <br /> <span className="font-semibold">back.</span>
          </h2>
          <p className="text-[#d4c5ab] text-lg lg:text-xl font-light leading-relaxed">
            Sign in to continue exploring the exclusive community of creators
            and shoppers.
          </p>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-20 bg-[#0e0e0e] overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-md xl:max-w-lg bg-[#131313] lg:bg-transparent rounded-3xl p-6 lg:p-0 border border-[#201f1f] lg:border-none shadow-2xl lg:shadow-none">
          <div className="mb-5">
            <h1 className="text-3xl lg:text-4xl font-light mb-2 tracking-wide">
              Sign in to{" "}
              <span className="font-semibold text-[#ffc107]">Snitch</span>
            </h1>
            <p className="text-[#a19f9d] text-base font-light">
              Enter your email and password to access your account.
            </p>
            {errorMsg && (
              <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {errorMsg}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 md:space-y-4 flex flex-col"
          >
            <div className="space-y-1.5">
              <label
                className="text-sm tracking-wide text-[#d4c5ab] ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-4 py-2.5 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label
                  className="text-sm tracking-wide text-[#d4c5ab]"
                  htmlFor="password"
                >
                  Password
                </label>
                <span className="text-xs text-[#ffc107] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-4 py-2.5 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full mt-4 bg-gradient-to-r from-[#ffe4af] to-[#ffc107] hover:from-[#ffc107] hover:to-[#fabd00] text-[#261a00] font-semibold text-lg rounded-full py-2.5 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(255,193,7,0.15)] hover:shadow-[0_8px_30px_rgba(255,193,7,0.25)] focus:outline-none"
            >
              Sign In
            </button>

            <ContinueWithGoogle />

            <div className="text-center mt-3 pb-2 lg:pb-0">
              <p className="text-[#9c8f78] text-sm md:text-[15px]">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-[#ffc107] hover:underline cursor-pointer font-medium"
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
