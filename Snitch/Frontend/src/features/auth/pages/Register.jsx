import React, { useState } from "react";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      fullName: formData.fullName,
      isSeller: formData.isSeller,
    });
    setFormData({
      fullName: "",
      email: "",
      contactNumber: "",
      password: "",
      isSeller: false,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#0e0e0e] text-[#e5e2e1] flex flex-col lg:flex-row font-sans">
      {/* Left Panel - Image Area (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#131313] items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop"
          alt="Fashion Experience"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent"></div>

        {/* Seamless blend gradient on the right edge */}
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#0e0e0e] to-transparent z-10 pointer-events-none"></div>

        <div className="absolute bottom-16 left-12 lg:bottom-20 lg:left-20 max-w-lg z-20">
          <div className="w-16 h-1 bg-[#ffc107] mb-5 rounded-full"></div>
          <h2 className="text-5xl lg:text-6xl font-light mb-5 text-white leading-tight">
            Define your <br /> <span className="font-semibold">style.</span>
          </h2>
          <p className="text-[#d4c5ab] text-lg lg:text-xl font-light leading-relaxed">
            Join the exclusive community of creators and shoppers leading modern
            fashion.
          </p>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 xl:p-24 bg-[#0e0e0e] overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-md xl:max-w-lg bg-[#131313] lg:bg-transparent rounded-3xl p-8 lg:p-0 border border-[#201f1f] lg:border-none shadow-2xl lg:shadow-none">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-light mb-3 tracking-wide">
              Join <span className="font-semibold text-[#ffc107]">Snitch</span>
            </h1>
            <p className="text-[#a19f9d] text-base lg:text-lg font-light">
              Elevate your wardrobe. Create an account below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 md:space-y-5 flex flex-col"
          >
            <div className="space-y-1.5">
              <label
                className="text-sm tracking-wide text-[#d4c5ab] ml-1"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-4 py-3 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

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
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-4 py-3 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-sm tracking-wide text-[#d4c5ab] ml-1"
                htmlFor="contactNumber"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="1234567890"
                pattern="[0-9]{10}"
                title="Contact must be a 10-digit number"
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-4 py-3 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-sm tracking-wide text-[#d4c5ab] ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-4 py-3 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

            {/* isSeller Checkbox */}
            <div
              className="flex items-center mt-2 group cursor-pointer select-none"
              onClick={() =>
                setFormData((p) => ({ ...p, isSeller: !p.isSeller }))
              }
            >
              <div
                className={`w-5 h-5 \n rounded flex items-center justify-center border transition-all duration-300 ${formData.isSeller ? "bg-[#ffc107] border-[#ffc107]" : "border-[#4f4632] group-hover:border-[#ffc107]"}`}
              >
                <svg
                  className={`w-3.5 h-3.5 text-[#261a00] transform transition-transform duration-300 ${formData.isSeller ? "scale-100" : "scale-0"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <span className="text-[#e5e2e1] text-[15px] font-medium leading-none">
                  I want to register as a Seller
                </span>
                <p className="text-xs text-[#9c8f78] mt-1 hidden sm:block">
                  Check this if you plan to sell clothes on Snitch.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-[#ffe4af] to-[#ffc107] hover:from-[#ffc107] hover:to-[#fabd00] text-[#261a00] font-semibold text-lg rounded-full py-3 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(255,193,7,0.15)] hover:shadow-[0_8px_30px_rgba(255,193,7,0.25)] focus:outline-none"
            >
              Create Account
            </button>

            <div className="text-center mt-4 pb-2 lg:pb-0">
              <p className="text-[#9c8f78] text-sm md:text-[15px]">
                Already have an account?{" "}
                <span className="text-[#ffc107] hover:underline cursor-pointer font-medium">
                  Sign in
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
