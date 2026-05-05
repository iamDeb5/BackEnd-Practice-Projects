import { useState } from "react";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

/* ─────────────────────────────────────────────────────────────
   LOGIN PAGE  —  "Enter the Vault"
   Reference: editorial split-screen, cream right panel,
   underline inputs, solid dark CTA, Playfair Display headline
───────────────────────────────────────────────────────────── */

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await handleLogin({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div
      className="h-screen overflow-hidden flex flex-col lg:flex-row"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── LEFT — editorial photo panel ───────────────────────────────────── */}
      <div className="hidden lg:block lg:w-[48%] xl:w-1/2 relative flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=90&w=2070&auto=format&fit=crop&crop=top"
          alt="Snitch fashion"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        {/* Right-edge cream gradient — blends photo into the form panel */}
        <div
          className="absolute inset-y-0 right-0 w-36 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, #FAF8F5)" }}
        />

        {/* Copy */}
        <div className="absolute bottom-12 left-10 xl:left-14 right-10 z-10">
          <p className="text-white/60 text-xs tracking-[0.2em] uppercase mb-3 font-light">
            Snitch — Fashion Forward
          </p>
          <h2
            className="text-white leading-[1.15] mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 3.5vw, 3.5rem)",
            }}
          >
            Welcome <br />
            <em>back.</em>
          </h2>
          <p className="text-white/55 text-sm leading-relaxed max-w-xs font-light">
            Sign in to explore the latest exclusive drops and manage your
            aesthetic.
          </p>
        </div>
      </div>

      {/* ── RIGHT — form panel ─────────────────────────────────────────────── */}
      <div
        className="flex-1 h-full flex items-center justify-center px-8 sm:px-12 lg:px-12 xl:px-16"
        style={{ backgroundColor: "#FAF8F5" }}
      >
        <div className="w-full max-w-sm">

          {/* Eyebrow + headline */}
          <p
            className="text-xs tracking-[0.22em] uppercase mb-3 font-semibold"
            style={{ color: "#C9A96E" }}
          >
            Sign In to Snitch
          </p>
          <h1
            className="mb-7 leading-tight text-[#1a1a1a]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.9rem, 3vw, 2.6rem)",
            }}
          >
            Enter the Vault
          </h1>

          {/* Error */}
          {errorMsg && (
            <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2.5">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">

            {/* Email */}
            <UnderlineField
              id="email" name="email" type="email"
              label="Email Address" placeholder="hello@example.com"
              value={formData.email} onChange={handleChange}
              required
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[10px] tracking-[0.18em] uppercase font-semibold"
                  style={{ color: "#888" }}
                >
                  Password
                </label>
                <span
                  className="text-[10px] tracking-wide cursor-pointer hover:text-[#1a1a1a] transition-colors"
                  style={{ color: "#aaa" }}
                >
                  Forgot password?
                </span>
              </div>
              <input
                id="password" name="password" type="password"
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" required
                className="w-full bg-transparent border-0 border-b pb-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none transition-colors duration-150"
                style={{ borderBottom: "1px solid #ddd" }}
                onFocus={(e) => (e.target.style.borderBottomColor = "#1a1a1a")}
                onBlur={(e) => (e.target.style.borderBottomColor = "#ddd")}
              />
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#1a1a1a] hover:bg-[#2e2e2e] text-white text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-200 cursor-pointer mt-1"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#e0ddd8]" />
              <span className="text-xs text-[#aaa] tracking-widest">OR</span>
              <div className="flex-1 h-px bg-[#e0ddd8]" />
            </div>

            {/* Google */}
            <ContinueWithGoogle variant="light" />

            {/* Switch link */}
            <p className="text-center text-xs text-[#888] mt-1">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-[#1a1a1a] font-medium underline underline-offset-2 cursor-pointer hover:text-[#555]"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ── Underline input field ────────────────────────────────────────────────── */
const UnderlineField = ({ id, name, type, label, placeholder, value, onChange, required }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-[10px] tracking-[0.18em] uppercase font-semibold"
      style={{ color: "#888" }}
    >
      {label}
    </label>
    <input
      id={id} name={name} type={type}
      value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      className="w-full bg-transparent border-0 border-b pb-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none transition-colors duration-150"
      style={{ borderBottom: "1px solid #ddd" }}
      onFocus={(e) => (e.target.style.borderBottomColor = "#1a1a1a")}
      onBlur={(e) => (e.target.style.borderBottomColor = "#ddd")}
    />
  </div>
);

export default Login;
