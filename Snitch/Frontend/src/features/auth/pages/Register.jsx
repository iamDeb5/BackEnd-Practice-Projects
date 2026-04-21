import React, { useState } from "react";

const Register = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1] flex flex-col lg:flex-row font-sans">
      {/* Left Panel - Image Area (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#131313] items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop"
          alt="Fashion Experience"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent"></div>
        <div className="absolute bottom-24 left-20 max-w-lg z-10">
          <div className="w-16 h-1 bg-[#ffc107] mb-6 rounded-full"></div>
          <h2 className="text-6xl font-light mb-6 text-white leading-tight">
            Define your <br /> <span className="font-semibold">style.</span>
          </h2>
          <p className="text-[#d4c5ab] text-xl font-light leading-relaxed">
            Join the exclusive community of creators and shoppers leading modern
            fashion.
          </p>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-[#0e0e0e]">
        <div className="w-full max-w-md xl:max-w-lg bg-[#131313] lg:bg-transparent rounded-3xl p-10 lg:p-0 border border-[#201f1f] lg:border-none shadow-2xl lg:shadow-none">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">
              Join <span className="font-semibold text-[#ffc107]">Snitch</span>
            </h1>
            <p className="text-[#a19f9d] text-base md:text-lg font-light">
              Elevate your wardrobe. Create an account below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 md:space-y-8 flex flex-col"
          >
            <div className="space-y-2">
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
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-5 py-4 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

            <div className="space-y-2">
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
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-5 py-4 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

            <div className="space-y-2">
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
                placeholder="+1 234 567 890"
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-5 py-4 focus:outline-none focus:bg-[#201f1f]"
                required
              />
            </div>

            <div className="space-y-2">
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
                className="w-full bg-[#1c1b1b] text-white border border-transparent focus:border-[#ffc107] transition-all rounded-xl px-5 py-4 focus:outline-none focus:bg-[#201f1f]"
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
                className={`w-6 h-6 rounded flex items-center justify-center border transition-all duration-300 ${formData.isSeller ? "bg-[#ffc107] border-[#ffc107]" : "border-[#4f4632] group-hover:border-[#ffc107]"}`}
              >
                <svg
                  className={`w-4 h-4 text-[#261a00] transform transition-transform duration-300 ${formData.isSeller ? "scale-100" : "scale-0"}`}
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
              <div className="ml-4">
                <span className="text-[#e5e2e1] text-base font-medium">
                  I want to register as a Seller
                </span>
                <p className="text-sm text-[#9c8f78] mt-1">
                  Check this if you plan to sell clothes on Snitch.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-[#ffe4af] to-[#ffc107] hover:from-[#ffc107] hover:to-[#fabd00] text-[#261a00] font-semibold text-lg md:text-xl rounded-full py-4 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_30px_rgba(255,193,7,0.15)] hover:shadow-[0_8px_40px_rgba(255,193,7,0.25)] focus:outline-none"
            >
              Create Account
            </button>
            <div className="text-center mt-6">
              <p className="text-[#9c8f78] text-sm">
                Already have an account?{" "}
                <span className="text-[#ffc107] hover:underline cursor-pointer">
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
