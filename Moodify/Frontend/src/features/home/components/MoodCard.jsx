import React, { useState } from "react";
import { useSong } from "../hooks/useSong";
import "../styles/MoodCard.scss";

/* ── Mood palette ─────────────────────────────────────── */
const MOOD_META = {
  happy: { color: "#f5a623", emoji: "☀️", label: "Happy" },
  sad: { color: "#5b8db8", emoji: "🌧️", label: "Sad" },
  angry: { color: "#e05252", emoji: "🔥", label: "Angry" },
  surprised: { color: "#9b59b6", emoji: "⚡", label: "Surprised" },
  fearful: { color: "#e67e22", emoji: "🌑", label: "Fearful" },
  disgusted: { color: "#27ae60", emoji: "🍃", label: "Disgusted" },
  neutral: { color: "#7f8c8d", emoji: "🌫️", label: "Neutral" },
};
const DEFAULT_META = MOOD_META.neutral;

/* ── Icons ────────────────────────────────────────────── */
const PlayIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21" />
  </svg>
);

const MusicNoteIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    opacity="0.5"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

/* ── Empty / loading state ────────────────────────────── */
const EmptyState = ({ meta, loading }) => (
  <div className="song-panel__empty">
    <span className="song-panel__empty-icon" style={{ color: meta.color }}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </span>
    <p className="song-panel__empty-title">
      {loading ? "Matching your mood…" : "No songs yet"}
    </p>
    <p className="song-panel__empty-hint">
      {loading
        ? "Hang tight while we find the perfect tracks"
        : "Detect your mood to get song recommendations"}
    </p>
  </div>
);

/* ── Component ────────────────────────────────────────── */
const MoodCard = ({ onListenMore }) => {
  const { songs, song: currentSong, setSong, mood, loading } = useSong();
  const [hoveredId, setHoveredId] = useState(null);

  const moodKey = mood?.toLowerCase() || "neutral";
  const meta = MOOD_META[moodKey] || DEFAULT_META;

  return (
    <section className="song-panel">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="song-panel__header">
        <div
          className="song-panel__mood-pill"
          style={{ "--accent": meta.color }}
        >
          <span className="song-panel__mood-emoji">{meta.emoji}</span>
          <span className="song-panel__mood-name">{meta.label}</span>
        </div>
        <p className="song-panel__caption">
          {loading
            ? "Finding your vibe…"
            : songs.length > 0
              ? `${songs.length} song${songs.length !== 1 ? "s" : ""} for your mood`
              : "Songs for your mood"}
        </p>
      </header>

      {/* ── Accent divider ──────────────────────────────── */}
      <div className="song-panel__divider" style={{ "--accent": meta.color }} />

      {/* ── Song list or empty state ─────────────────────── */}
      {songs.length === 0 ? (
        <EmptyState meta={meta} loading={loading} />
      ) : (
        <ol className="song-panel__list">
          {songs.map((s, idx) => {
            const isPlaying =
              currentSong &&
              (currentSong._id === s._id || currentSong.id === s.id);
            return (
              <li
                key={s._id || s.id || idx}
                className={`song-row${hoveredId === idx ? " song-row--hovered" : ""}${isPlaying ? " song-row--playing" : ""}`}
                style={{ "--accent": meta.color }}
                onMouseEnter={() => setHoveredId(idx)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSong(s)}
              >
                {/* Index / play */}
                <div className="song-row__index">
                  {hoveredId === idx ? (
                    <span
                      className="song-row__play-icon"
                      style={{ color: meta.color }}
                    >
                      <PlayIcon />
                    </span>
                  ) : (
                    <span className="song-row__num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                <div
                  className="song-row__thumb"
                  style={!s.posterUrl ? { background: `${meta.color}22` } : {}}
                >
                  {s.posterUrl ? (
                    <img src={s.posterUrl} alt={s.title} />
                  ) : (
                    <span style={{ color: meta.color }}>
                      <MusicNoteIcon />
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="song-row__info">
                  <span className="song-row__title">{s.title}</span>
                  <span className="song-row__artist">
                    {s.artist || "Unknown Artist"}
                  </span>
                </div>

                {/* Duration placeholder (real duration needs Web Audio API) */}
                <span className="song-row__duration">—</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

export default MoodCard;
