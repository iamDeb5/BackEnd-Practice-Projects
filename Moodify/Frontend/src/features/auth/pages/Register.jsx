import React, { useState, useMemo } from "react";
import "../styles/register.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

/* ── SVG helpers ──────────────────────────────────────── */
const Waveform = ({ className }) => (
  <svg className={className} viewBox="0 0 60 60" fill="none">
    <rect
      x="4"
      y="20"
      width="6"
      height="20"
      rx="3"
      fill="currentColor"
      opacity="0.6"
    />
    <rect
      x="14"
      y="10"
      width="6"
      height="40"
      rx="3"
      fill="currentColor"
      opacity="0.5"
    />
    <rect
      x="24"
      y="16"
      width="6"
      height="28"
      rx="3"
      fill="currentColor"
      opacity="0.7"
    />
    <rect
      x="34"
      y="6"
      width="6"
      height="48"
      rx="3"
      fill="currentColor"
      opacity="0.4"
    />
    <rect
      x="44"
      y="18"
      width="6"
      height="24"
      rx="3"
      fill="currentColor"
      opacity="0.6"
    />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const MOODS = [
  { emoji: "😌", label: "calm", top: "70%", left: "90%" },
  { emoji: "😄", label: "joyful", top: "20%", left: "4%" },
];

/* ── Password strength ────────────────────────────────── */
const getStrength = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0-4
};
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#e53535", "#f5a623", "#4caf8a", "#2e7d5e"];

/* ── Validation ───────────────────────────────────────── */
const validate = ({ username, email, password, confirmPassword, agreed }) => {
  const errs = {};

  if (!username.trim()) {
    errs.username = "Username is required.";
  } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
    errs.username = "3–20 characters: letters, numbers and underscores only.";
  }

  if (!email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errs.email = "Enter a valid email address.";
  }

  if (!password) {
    errs.password = "Password is required.";
  } else if (password.length < 6) {
    errs.password = "Password must be at least 6 characters.";
  }

  if (!confirmPassword) {
    errs.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errs.confirmPassword = "Passwords do not match.";
  }

  if (!agreed) {
    errs.agreed = "You must agree to the Terms & Conditions.";
  }

  return errs;
};

/* ── Component ────────────────────────────────────────── */
const Register = () => {
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPwd] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const strength = useMemo(() => getStrength(password), [password]);

  const handleBlur = (field) => {
    const errs = validate({
      username,
      email,
      password,
      confirmPassword,
      agreed,
    });
    if (errs[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
    } else {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate({
      username,
      email,
      password,
      confirmPassword,
      agreed,
    });
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    const success = await handleRegister({
      username: username.trim(),
      email: email.trim(),
      password,
    });
    if (success) {
      navigate("/");
    } else {
      setServerError(
        "Registration failed. That email or username may already be taken.",
      );
    }
  };

  return (
    <main className="auth-page auth-page--register">
      <div className="auth-page__blob auth-page__blob--a" />
      <div className="auth-page__blob auth-page__blob--b" />
      <Waveform className="auth-page__wave auth-page__wave--left" />
      <Waveform className="auth-page__wave auth-page__wave--right" />
      {MOODS.map(({ emoji, label, top, left }) => (
        <div key={label} className="auth-page__mood" style={{ top, left }}>
          <span className="auth-page__mood-emoji">{emoji}</span>
          <span className="auth-page__mood-label">{label}</span>
        </div>
      ))}

      <div className="auth-card">
        {/* Step dots */}
        <div className="auth-card__steps">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`auth-card__step-dot${i === 2 ? " auth-card__step-dot--active" : ""}`}
            />
          ))}
        </div>

        <h1 className="auth-card__title">Create Your Profile</h1>
        <p className="auth-card__subtitle">
          Join Moodify — it only takes a minute
        </p>

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div
            className={`auth-field${fieldErrors.username ? " auth-field--error" : ""}`}
          >
            <span className="auth-field__icon">
              <UserIcon />
            </span>
            <input
              id="reg-username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleBlur("username")}
              autoComplete="username"
              autoCapitalize="none"
            />
          </div>
          {fieldErrors.username && (
            <p className="auth-field__error-msg">{fieldErrors.username}</p>
          )}

          {/* Email */}
          <div
            className={`auth-field${fieldErrors.email ? " auth-field--error" : ""}`}
          >
            <span className="auth-field__icon">
              <MailIcon />
            </span>
            <input
              id="reg-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              autoComplete="email"
            />
          </div>
          {fieldErrors.email && (
            <p className="auth-field__error-msg">{fieldErrors.email}</p>
          )}

          {/* Password */}
          <div
            className={`auth-field${fieldErrors.password ? " auth-field--error" : ""}`}
          >
            <span className="auth-field__icon">
              <LockIcon />
            </span>
            <input
              id="reg-password"
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-field__eye"
              onClick={() => setShowPwd((v) => !v)}
              tabIndex={-1}
            >
              {showPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="auth-field__error-msg">{fieldErrors.password}</p>
          )}

          {/* Password strength bar */}
          {password && (
            <div className="auth-strength">
              <div className="auth-strength__bars">
                {[1, 2, 3, 4].map((lvl) => (
                  <span
                    key={lvl}
                    className="auth-strength__bar"
                    style={{
                      background:
                        lvl <= strength ? STRENGTH_COLORS[strength] : undefined,
                    }}
                  />
                ))}
              </div>
              <span
                className="auth-strength__label"
                style={{ color: STRENGTH_COLORS[strength] }}
              >
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          )}

          {/* Confirm Password */}
          <div
            className={`auth-field${fieldErrors.confirmPassword ? " auth-field--error" : ""}`}
          >
            <span className="auth-field__icon">
              <CheckIcon />
            </span>
            <input
              id="reg-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPwd(e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-field__eye"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="auth-field__error-msg">
              {fieldErrors.confirmPassword}
            </p>
          )}

          {/* Terms */}
          <label
            className={`auth-card__terms${fieldErrors.agreed ? " auth-card__terms--error" : ""}`}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.agreed;
                    return next;
                  });
                }
              }}
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="auth-card__terms-link">
                Terms &amp; Conditions
              </Link>
            </span>
          </label>
          {fieldErrors.agreed && (
            <p className="auth-field__error-msg">{fieldErrors.agreed}</p>
          )}

          {serverError && <p className="auth-card__error">{serverError}</p>}

          <button
            className="auth-card__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? <span className="auth-card__spinner" /> : "SIGN UP"}
          </button>
        </form>

        <p className="auth-card__toggle">
          Already have an account?{" "}
          <Link to="/login" className="auth-card__toggle-link">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
