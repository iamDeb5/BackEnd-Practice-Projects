import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "./Profile.scss";

const MOOD_COLORS = {
  happy: { bg: "#FFF3E0", text: "#E65100", emoji: "😄" },
  sad: { bg: "#E3F2FD", text: "#1565C0", emoji: "😢" },
  surprised: { bg: "#F3E5F5", text: "#6A1B9A", emoji: "😮" },
  neutral: { bg: "#F5F5F5", text: "#424242", emoji: "😐" },
  angry: { bg: "#FFEBEE", text: "#B71C1C", emoji: "😠" },
  fearful: { bg: "#FFF8E1", text: "#F57F17", emoji: "😨" },
};

const RECENT_MOODS = ["happy", "neutral", "surprised", "happy", "sad"];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarGradient(name = "") {
  const colors = [
    ["#4CAF8A", "#2e7d5e"],
    ["#c9a96e", "#8d6e3f"],
    ["#5B8DB8", "#2c5282"],
    ["#E08060", "#a0522d"],
    ["#9B59B6", "#6a1b9a"],
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

const Profile = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = getInitials(user?.username || "U");
  const [fromColor, toColor] = getAvatarGradient(user?.username || "U");

  const joinDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  async function onLogout() {
    setLoggingOut(true);
    await handleLogout();
    navigate("/login");
  }

  return (
    <div className="profile-page">
      {/* Background blobs */}
      <div className="profile-page__blob profile-page__blob--teal" />
      <div className="profile-page__blob profile-page__blob--peach" />

      {/* Back button */}
      <button className="profile-page__back" onClick={() => navigate("/")}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className="profile-card">
        {/* Avatar */}
        <div
          className="profile-card__avatar"
          style={{
            background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
          }}
        >
          <span>{initials}</span>
        </div>

        {/* Name + Email */}
        <div className="profile-card__header">
          <h1 className="profile-card__name">{user?.username || "User"}</h1>
          <p className="profile-card__email">{user?.email || ""}</p>
          <span className="profile-card__badge">🎵 Moodify Member</span>
        </div>

        {/* Stats row */}
        <div className="profile-card__stats">
          <div className="profile-card__stat">
            <span className="profile-card__stat-value">3</span>
            <span className="profile-card__stat-label">Moods Today</span>
          </div>
          <div className="profile-card__stat-divider" />
          <div className="profile-card__stat">
            <span className="profile-card__stat-value">😄</span>
            <span className="profile-card__stat-label">Top Mood</span>
          </div>
          <div className="profile-card__stat-divider" />
          <div className="profile-card__stat">
            <span className="profile-card__stat-value">{joinDate}</span>
            <span className="profile-card__stat-label">Joined</span>
          </div>
        </div>

        {/* Info section */}
        <div className="profile-card__info">
          <h2 className="profile-card__section-title">Account Details</h2>
          <div className="profile-card__info-row">
            <span className="profile-card__info-label">
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
              Username
            </span>
            <span className="profile-card__info-value">{user?.username}</span>
          </div>
          <div className="profile-card__info-row">
            <span className="profile-card__info-label">
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </span>
            <span className="profile-card__info-value">{user?.email}</span>
          </div>
          <div className="profile-card__info-row">
            <span className="profile-card__info-label">
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
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Password
            </span>
            <span className="profile-card__info-value profile-card__info-value--dots">
              ••••••••
            </span>
          </div>
        </div>

        {/* Recent Moods */}
        <div className="profile-card__moods">
          <h2 className="profile-card__section-title">Recent Moods</h2>
          <div className="profile-card__mood-chips">
            {RECENT_MOODS.map((mood, i) => {
              const cfg = MOOD_COLORS[mood] || MOOD_COLORS.neutral;
              return (
                <span
                  key={i}
                  className="profile-card__mood-chip"
                  style={{ background: cfg.bg, color: cfg.text }}
                >
                  {cfg.emoji} {mood}
                </span>
              );
            })}
          </div>
        </div>

        {/* Logout button */}
        <button
          className="profile-card__logout"
          onClick={onLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            "Logging out..."
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log Out
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;
