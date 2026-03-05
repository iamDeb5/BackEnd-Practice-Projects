import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSong } from "../hooks/useSong";
import "../styles/Player.scss";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatTime = (secs) => {
  if (isNaN(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/* ─── SVG Icons (inline, no extra deps) ─────────────── */
const IconPlay = () => (
  <svg viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" fill="white" stroke="none" />
  </svg>
);

const IconPause = () => (
  <svg viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" rx="1" fill="white" stroke="none" />
    <rect
      x="14"
      y="4"
      width="4"
      height="16"
      rx="1"
      fill="white"
      stroke="none"
    />
  </svg>
);

const IconRewind = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.45" />
  </svg>
);

const IconFastFwd = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-.49-3.45" />
  </svg>
);

const IconVolume = () => (
  <svg viewBox="0 0 24 24">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

/* ─── Player Component ──────────────────────────────── */
const Player = () => {
  const { song } = useSong();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const progressTrackRef = useRef(null);
  const speedMenuRef = useRef(null);

  /* ── Sync audio src when song changes ── */
  useEffect(() => {
    if (!audioRef.current || !song?.url) return;
    audioRef.current.src = song.url;
    audioRef.current.load();
    setIsPlaying(false);
    setCurrentTime(0);
  }, [song?.url]);

  /* ── Volume sync ── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* ── Speed sync ── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  /* ── Play / Pause toggle ── */
  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  /* ── Skip ±5s ── */
  const skip = useCallback((delta) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(
        audioRef.current.duration || 0,
        audioRef.current.currentTime + delta,
      ),
    );
  }, []);

  /* ── Audio event handlers ── */
  const onTimeUpdate = () => setCurrentTime(audioRef.current?.currentTime ?? 0);
  const onLoadedMetadata = () => setDuration(audioRef.current?.duration ?? 0);
  const onEnded = () => setIsPlaying(false);

  /* ── Progress bar seek ── */
  const seek = (e) => {
    if (!progressTrackRef.current || !audioRef.current || !duration) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    audioRef.current.currentTime = ratio * duration;
  };

  /* ── Close speed menu on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target)) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`player-wrapper`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        preload="metadata"
      />

      <div className={`player ${isPlaying ? "playing" : ""}`}>
        {/* ── Song Info ── */}
        <div className="player__info">
          <div className="player__artwork-wrap">
            <img
              className="player__artwork"
              src={
                song?.posterUrl ||
                "https://via.placeholder.com/54x54/1a1a2e/a855f7?text=♫"
              }
              alt={song?.title || "Song artwork"}
            />
          </div>
          <div className="player__meta">
            <p className="player__title">{song?.title || "No song loaded"}</p>
            {song?.mood && <span className="player__mood">{song.mood}</span>}
          </div>
        </div>

        {/* ── Center: controls + progress ── */}
        <div className="player__center">
          <div className="player__controls">
            {/* Rewind 5s */}
            <button
              className="ctrl-btn ctrl-btn--skip"
              onClick={() => skip(-5)}
              title="Rewind 5 seconds"
              aria-label="Rewind 5 seconds"
            >
              <IconRewind />
              <span className="skip-label">5s</span>
            </button>

            {/* Play / Pause */}
            <button
              className="ctrl-btn ctrl-btn--play"
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>

            {/* Forward 5s */}
            <button
              className="ctrl-btn ctrl-btn--skip"
              onClick={() => skip(5)}
              title="Forward 5 seconds"
              aria-label="Forward 5 seconds"
            >
              <IconFastFwd />
              <span className="skip-label">5s</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="player__progress">
            <span className="time-label">{formatTime(currentTime)}</span>
            <div
              ref={progressTrackRef}
              className="progress-track"
              onClick={seek}
              role="slider"
              aria-label="Seek"
              aria-valuenow={Math.round(currentTime)}
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
            >
              <div
                className="progress-fill"
                style={{ width: `${progressPct}%` }}
              >
                <div className="progress-thumb" />
              </div>
            </div>
            <span className="time-label">{formatTime(duration)}</span>
          </div>
        </div>

        {/* ── Right: Speed + Volume ── */}
        <div className="player__right">
          {/* Speed control */}
          <div className="speed-control" ref={speedMenuRef}>
            <button
              className={`speed-btn ${showSpeedMenu ? "active" : ""}`}
              onClick={() => setShowSpeedMenu((v) => !v)}
              aria-label="Playback speed"
              aria-haspopup="listbox"
            >
              {speed === 1 ? "1× Speed" : `${speed}× Speed`}
            </button>

            {showSpeedMenu && (
              <div
                className="speed-menu"
                role="listbox"
                aria-label="Playback speed options"
              >
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    role="option"
                    aria-selected={speed === s}
                    className={`speed-option ${speed === s ? "selected" : ""}`}
                    onClick={() => {
                      setSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                  >
                    {s === 1 ? "Normal" : `${s}×`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="volume-row">
            <IconVolume />
            <input
              type="range"
              className="volume-slider"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
