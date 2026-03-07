import React, { useState } from "react";
import "../styles/login.scss";
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

const MOODS = [
  { emoji: "😊", label: "happy", top: "72%", left: "5%" },
  { emoji: "😔", label: "sad", top: "18%", left: "88%" },
];

/* ── Validation ───────────────────────────────────────── */
const validate = ({ identifier, password }) => {
  const errs = {};

  if (!identifier.trim()) {
    errs.identifier = "Email or username is required.";
  } else if (identifier.includes("@")) {
    // looks like an email — validate format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      errs.identifier = "Enter a valid email address.";
    }
  } else {
    // treat as username — at least 3 chars, alphanumeric + _
    if (!/^[a-zA-Z0-9_]{3,}$/.test(identifier.trim())) {
      errs.identifier =
        "Username must be at least 3 characters (letters, numbers, _).";
    }
  }

  if (!password) {
    errs.password = "Password is required.";
  } else if (password.length < 6) {
    errs.password = "Password must be at least 6 characters.";
  }

  return errs;
};

/* ── Component ────────────────────────────────────────── */
const Login = () => {
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleBlur = (field) => {
    const errs = validate({ identifier, password });
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

    const errs = validate({ identifier, password });
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    // Determine if identifier is email or username
    const isEmail = identifier.includes("@");
    const payload = isEmail
      ? { email: identifier.trim(), password }
      : { username: identifier.trim(), password };

    const success = await handleLogin(payload);
    if (success) {
      navigate("/");
    } else {
      setServerError(
        "Invalid credentials. Please check your email/username and password.",
      );
    }
  };

  return (
    <main className="auth-page auth-page--login">
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
        {/* Brand */}
        <div className="auth-card__header">
          <div className="auth-card__logo-wrap">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#4caf8a" opacity="0.15" />
              <path
                d="M8 18 Q14 6 20 18"
                stroke="#4caf8a"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="auth-card__brand">Moodify</span>
        </div>

        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">
          Sign in with your email or username
        </p>

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          {/* Email or Username */}
          <div
            className={`auth-field${fieldErrors.identifier ? " auth-field--error" : ""}`}
          >
            <span className="auth-field__icon">
              <UserIcon />
            </span>
            <input
              id="login-identifier"
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onBlur={() => handleBlur("identifier")}
              autoComplete="username"
              autoCapitalize="none"
            />
          </div>
          {fieldErrors.identifier && (
            <p className="auth-field__error-msg">{fieldErrors.identifier}</p>
          )}

          {/* Password */}
          <div
            className={`auth-field${fieldErrors.password ? " auth-field--error" : ""}`}
          >
            <span className="auth-field__icon">
              <LockIcon />
            </span>
            <input
              id="login-password"
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-field__eye"
              onClick={() => setShowPwd((v) => !v)}
              tabIndex={-1}
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="auth-field__error-msg">{fieldErrors.password}</p>
          )}

          <div className="auth-card__forgot-row">
            <Link to="/forgot-password" className="auth-card__forgot">
              Forgot Password?
            </Link>
          </div>

          {serverError && <p className="auth-card__error">{serverError}</p>}

          <button
            className="auth-card__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? <span className="auth-card__spinner" /> : "SIGN IN"}
          </button>
        </form>

        <p className="auth-card__toggle">
          Don't have an account?{" "}
          <Link to="/register" className="auth-card__toggle-link">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
