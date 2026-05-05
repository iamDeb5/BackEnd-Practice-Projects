import { useState } from "react";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
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
    setErrorMsg("");
    try {
      await handleRegister({
        email: formData.email,
        contact: formData.contactNumber,
        password: formData.password,
        fullName: formData.fullName,
        isSeller: formData.isSeller,
      });
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    /*
     * ROOT — h-screen + overflow-hidden locks the whole page to viewport height.
     * Nothing can push outside of it, so no page-level scroll ever appears.
     */
    <div
      className="h-screen overflow-hidden flex flex-col lg:flex-row"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── LEFT — editorial photo panel ─────────────────────────────────── */}
      <div className="hidden lg:block lg:w-[48%] xl:w-1/2 relative flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=90&w=2070&auto=format&fit=crop&crop=top"
          alt="Snitch fashion"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Bottom fade — dark for legibility of copy */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

        {/*
         * ── RIGHT-EDGE GRADIENT ──
         * This is what creates the seamless "photo bleeding into form" effect.
         * A div positioned on the right edge of the photo panel, fading from
         * transparent → #FAF8F5 (the form panel's background color).
         */}
        <div
          className="absolute inset-y-0 right-0 w-36 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, #FAF8F5)",
          }}
        />

        {/* Bottom copy */}
        <div className="absolute bottom-10 left-10 xl:left-14 right-16 z-10">
          <p className="text-white/50 text-[10px] tracking-[0.25em] uppercase mb-3 font-light">
            Snitch — Fashion Forward
          </p>
          <h2
            className="text-white leading-[1.12] mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 3vw, 3.2rem)",
            }}
          >
            Define your <br />
            <em>aesthetic.</em>
          </h2>
          <p className="text-white/50 text-xs leading-relaxed max-w-[220px] font-light">
            Join the exclusive movement of creators and brands redefining modern fashion.
          </p>
        </div>
      </div>

      {/*
       * ── RIGHT — form panel ──────────────────────────────────────────────
       *
       * KEY FIX: NO overflow-y-auto here.
       * Instead:
       *   • The panel uses h-full so it fills the parent (which is h-screen).
       *   • Content is centered with items-center justify-center.
       *   • Spacing inside the form is kept tight so everything fits.
       *
       * HOW TO DIAGNOSE SCROLL IN THE FUTURE:
       *   1. Open DevTools → Elements → select the scrolling element.
       *   2. Look for `overflow: auto` or `overflow-y: auto/scroll` in Styles.
       *   3. Also check if a parent has a fixed height (h-screen) while the
       *      child content is taller → scroll appears automatically.
       *   4. Fix options:
       *      a) Remove overflow-y-auto (content must fit the height).
       *      b) Reduce padding/gap inside the form.
       *      c) If content MUST scroll, keep overflow-y-auto but constrain
       *         the scrollable area to a small sub-section, not the whole panel.
       */}
      <div
        className="flex-1 h-full flex items-center justify-center px-8 sm:px-12 lg:px-12 xl:px-16"
        style={{ backgroundColor: "#FAF8F5" }}
      >
        <div className="w-full max-w-[320px]">

          {/* Eyebrow */}
          <p
            className="text-[10px] tracking-[0.22em] uppercase mb-2.5 font-semibold"
            style={{ color: "#C9A96E" }}
          >
            Welcome to Snitch
          </p>

          {/* Headline */}
          <h1
            className="mb-6 leading-tight text-[#1a1a1a]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.65rem, 2.5vw, 2.2rem)",
            }}
          >
            Elevate Your Style
          </h1>

          {/* Error */}
          {errorMsg && (
            <div className="mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              {errorMsg}
            </div>
          )}

          {/* Form — gap-4 keeps fields compact enough to fit in viewport */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <UnderlineField
              id="fullName" name="fullName" type="text"
              label="Full Name" placeholder="e.g. John Doe"
              value={formData.fullName} onChange={handleChange} required
            />
            <UnderlineField
              id="contactNumber" name="contactNumber" type="tel"
              label="Contact Number" placeholder="+91 98765 43210"
              value={formData.contactNumber} onChange={handleChange}
              pattern="[0-9]{10}" title="Enter a 10-digit number" required
            />
            <UnderlineField
              id="email" name="email" type="email"
              label="Email Address" placeholder="hello@example.com"
              value={formData.email} onChange={handleChange} required
            />
            <UnderlineField
              id="password" name="password" type="password"
              label="Password" placeholder="••••••••"
              value={formData.password} onChange={handleChange} required
            />

            {/* Seller checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div
                onClick={() => setFormData((p) => ({ ...p, isSeller: !p.isSeller }))}
                className={[
                  "w-3.5 h-3.5 border flex items-center justify-center transition-all duration-200 shrink-0",
                  formData.isSeller
                    ? "bg-[#1a1a1a] border-[#1a1a1a]"
                    : "bg-transparent border-[#bbb] group-hover:border-[#1a1a1a]",
                ].join(" ")}
              >
                {formData.isSeller && (
                  <svg viewBox="0 0 12 9" fill="none" className="w-2 h-2">
                    <path d="M1 4.5l3 3 7-7" stroke="#FAF8F5" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] tracking-[0.16em] uppercase text-[#666] font-medium">
                Register as Seller
              </span>
            </label>

            {/* CTA */}
            <button
              type="submit"
              className="w-full py-3 bg-[#1a1a1a] hover:bg-[#333] text-white text-[10px] tracking-[0.22em] uppercase font-semibold transition-colors duration-200 cursor-pointer"
            >
              Sign Up
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e2ddd8]" />
              <span className="text-[10px] text-[#aaa] tracking-widest">OR</span>
              <div className="flex-1 h-px bg-[#e2ddd8]" />
            </div>

            <ContinueWithGoogle variant="light" />

            <p className="text-center text-[11px] text-[#999]">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#1a1a1a] font-semibold underline underline-offset-2 cursor-pointer hover:text-[#555]"
              >
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ── Reusable underline input ─────────────────────────────────────────────── */
const UnderlineField = ({ id, name, type, label, placeholder, value, onChange, required, pattern, title }) => (
  <div className="flex flex-col gap-1">
    <label
      htmlFor={id}
      className="text-[9px] tracking-[0.2em] uppercase font-semibold"
      style={{ color: "#999" }}
    >
      {label}
    </label>
    <input
      id={id} name={name} type={type}
      value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      pattern={pattern} title={title}
      className="w-full bg-transparent pb-1.5 text-[13px] text-[#1a1a1a] placeholder-[#ccc] outline-none transition-colors duration-150"
      style={{ borderBottom: "1px solid #ddd" }}
      onFocus={(e) => (e.target.style.borderBottomColor = "#1a1a1a")}
      onBlur={(e) => (e.target.style.borderBottomColor = "#ddd")}
    />
  </div>
);

export default Register;
