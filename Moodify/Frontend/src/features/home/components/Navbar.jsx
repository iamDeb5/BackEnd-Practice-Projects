import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { useTheme } from "../../shared/theme.context";
import "../styles/Navbar.scss";

/* ── Icons ─────────────────────────────────────────── */
const LeafIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 3C21 3 14 3 9 8C4 13 3 21 3 21C3 21 8 19 11 16C11 16 10 14 12 12C14 10 16 11 16 11C13 14 13 17 13 17C17 14 21 9 21 3Z"
      fill="#4CAF8A"
      stroke="#4CAF8A"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 21L10 14"
      stroke="#4CAF8A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const GearIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const BellIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const PaletteIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

/* ── Avatar helpers ──────────────────────────────── */
const AVATAR_GRADIENTS = [
  ["#4CAF8A", "#2e7d5e"],
  ["#c9a96e", "#8d6e3f"],
  ["#5B8DB8", "#2c5282"],
  ["#E08060", "#a0522d"],
  ["#9B59B6", "#6a1b9a"],
];
const getGradient = (n = "") =>
  AVATAR_GRADIENTS[(n.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];
const getInitials = (n = "") =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

/* ── Notification items ──────────────────────────── */
const NOTIFICATIONS = [
  {
    id: 1,
    icon: "😄",
    title: "Mood detected!",
    body: "Happy mood matched 3 songs for you.",
    time: "Just now",
  },
  {
    id: 2,
    icon: "🎵",
    title: "New playlist ready",
    body: "Your Happy playlist was updated.",
    time: "2 min ago",
  },
  {
    id: 3,
    icon: "✨",
    title: "Welcome to Moodify!",
    body: "Start by detecting your mood.",
    time: "Today",
  },
];

/* ═══════════════════════════════════════════════════ */
const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const { isDark, toggleTheme, colorId, setColorTheme, COLOR_THEMES } =
    useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const initials = getInitials(user?.username || "");
  const [fromColor, toColor] = getGradient(user?.username || "");

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setShowThemes(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function onLogout() {
    setMenuOpen(false);
    await handleLogout();
    navigate("/login");
  }

  return (
    <nav className="moodify-navbar">
      {/* Logo */}
      <div
        className="moodify-navbar__logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <LeafIcon />
        <span className="moodify-navbar__wordmark">Moodify</span>
      </div>

      <div className="moodify-navbar__actions">
        {/* ── Notifications Bell ── */}
        <div className="moodify-navbar__notif-wrap" ref={notifRef}>
          <button
            className={`moodify-navbar__bell ${showNotifs ? "moodify-navbar__bell--active" : ""}`}
            onClick={() => {
              setShowNotifs((v) => !v);
              setMenuOpen(false);
            }}
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="moodify-navbar__bell-dot" />
          </button>

          {showNotifs && (
            <div className="moodify-navbar__dropdown moodify-navbar__dropdown--notif">
              <div className="moodify-navbar__dropdown-header">
                <span className="moodify-navbar__dropdown-name">
                  Notifications
                </span>
                <button className="moodify-navbar__clear-btn">
                  Mark all read
                </button>
              </div>
              <div className="moodify-navbar__dropdown-divider" />
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="moodify-navbar__notif-item">
                  <span className="moodify-navbar__notif-icon">{n.icon}</span>
                  <div className="moodify-navbar__notif-body">
                    <span className="moodify-navbar__notif-title">
                      {n.title}
                    </span>
                    <span className="moodify-navbar__notif-text">{n.body}</span>
                    <span className="moodify-navbar__notif-time">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Dark / Light toggle ── */}
        <button
          className="moodify-navbar__theme-toggle"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* ── Avatar → Profile ── */}
        <button
          className="moodify-navbar__avatar"
          onClick={() => navigate("/profile")}
          title={`Profile (${user?.username || ""})`}
          style={{
            background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
          }}
        >
          <span className="moodify-navbar__initials">{initials}</span>
        </button>

        {/* ── Gear → Settings dropdown ── */}
        <div className="moodify-navbar__settings-wrap" ref={menuRef}>
          <button
            className={`moodify-navbar__gear ${menuOpen ? "moodify-navbar__gear--open" : ""}`}
            onClick={() => {
              setMenuOpen((v) => !v);
              setShowThemes(false);
              setShowNotifs(false);
            }}
            aria-label="Settings"
          >
            <GearIcon />
          </button>

          {menuOpen && (
            <div className="moodify-navbar__dropdown">
              <div className="moodify-navbar__dropdown-header">
                <span className="moodify-navbar__dropdown-name">
                  {user?.username}
                </span>
                <span className="moodify-navbar__dropdown-email">
                  {user?.email}
                </span>
              </div>
              <div className="moodify-navbar__dropdown-divider" />

              <button
                className="moodify-navbar__dropdown-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              >
                <svg
                  width="15"
                  height="15"
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
                View Profile
              </button>

              {/* Appearance — toggles theme sub-panel */}
              <button
                className={`moodify-navbar__dropdown-item ${showThemes ? "moodify-navbar__dropdown-item--active" : ""}`}
                onClick={() => setShowThemes((v) => !v)}
              >
                <PaletteIcon />
                Appearance
                <svg
                  style={{
                    marginLeft: "auto",
                    transform: showThemes ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Theme picker — shown inline below Appearance */}
              {showThemes && (
                <div className="moodify-navbar__themes">
                  {COLOR_THEMES.map((t) => (
                    <button
                      key={t.id}
                      className={`moodify-navbar__theme-btn ${colorId === t.id ? "moodify-navbar__theme-btn--active" : ""}`}
                      onClick={() => {
                        setColorTheme(t.id);
                      }}
                      title={t.label}
                    >
                      <span
                        className="moodify-navbar__theme-swatch"
                        style={{ background: t.light }}
                      />
                      <span className="moodify-navbar__theme-label">
                        {t.emoji} {t.label}
                      </span>
                      {colorId === t.id && (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4CAF8A"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Notifications shortcut */}
              <button
                className="moodify-navbar__dropdown-item"
                onClick={() => {
                  setMenuOpen(false);
                  setShowNotifs(true);
                }}
              >
                <BellIcon />
                Notifications
                <span className="moodify-navbar__notif-badge">3</span>
              </button>

              <div className="moodify-navbar__dropdown-divider" />
              <button
                className="moodify-navbar__dropdown-item moodify-navbar__dropdown-item--danger"
                onClick={onLogout}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
