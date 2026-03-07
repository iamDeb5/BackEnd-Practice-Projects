import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSong } from "../hooks/useSong";
import "../styles/Player.scss";

/* ─── Helpers ─────────────────────────────────────── */
const formatTime = (secs) => {
  if (isNaN(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/* ─── Icons ───────────────────────────────────────── */
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21" />
  </svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const IconSkipBack = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="19 20 9 12 19 4" />
    <line x1="5" y1="19" x2="5" y2="5" />
  </svg>
);
const IconSkipFwd = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 4 15 12 5 20" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </svg>
);
const IconShuffle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);
const IconRepeat = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const IconRepeatOne = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    <text
      x="11.5"
      y="14"
      fontSize="7"
      fontWeight="bold"
      fill="currentColor"
      stroke="none"
      textAnchor="middle"
    >
      1
    </text>
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconVolumeHigh = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const IconVolumeLow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const IconVolumeMute = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

/* ─── Player ──────────────────────────────────────── */
const Player = () => {
  const { song } = useSong();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  // repeat: 'none' | 'all' | 'one'
  const [repeat, setRepeat] = useState("none");
  const [hoveredTime, setHoveredTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  const progressRef = useRef(null);

  /* ── Sync audio src ── */
  useEffect(() => {
    if (!audioRef.current || !song?.url) return;
    audioRef.current.src = song.url;
    audioRef.current.load();
    setCurrentTime(0);
    setLiked(false);

    // Auto-play the new song
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error("Auto-play blocked or failed:", err);
        setIsPlaying(false);
      });
  }, [song?.url]);

  /* ── Volume / mute sync ── */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  /* ── Repeat sync ── */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = repeat === "one";
    }
  }, [repeat]);

  /* ── Toggle play ── */
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

  /* ── Skip ±10s ── */
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

  /* ── Audio events ── */
  const onTimeUpdate = () => setCurrentTime(audioRef.current?.currentTime ?? 0);
  const onLoadedMeta = () => setDuration(audioRef.current?.duration ?? 0);
  const onEnded = () => {
    if (repeat === "one") return; // loop handles it
    setIsPlaying(false);
  };

  /* ── Seek ── */
  const seek = (e) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    audioRef.current.currentTime = ratio * duration;
  };

  /* ── Progress bar hover preview ── */
  const onProgressHover = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    setHoveredTime(ratio * duration);
    setHoverX(e.clientX - rect.left);
  };

  /* ── Cycle repeat mode ── */
  const cycleRepeat = () => {
    setRepeat((r) => (r === "none" ? "all" : r === "all" ? "one" : "none"));
  };

  /* ── Mute toggle ── */
  const toggleMute = () => setIsMuted((m) => !m);

  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const effectiveVol = isMuted ? 0 : volume;

  const VolumeIcon =
    effectiveVol === 0
      ? IconVolumeMute
      : effectiveVol < 0.5
        ? IconVolumeLow
        : IconVolumeHigh;

  return (
    <div className="player-wrapper">
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMeta}
        onEnded={onEnded}
        preload="metadata"
      />

      <div className={`player ${isPlaying ? "player--playing" : ""}`}>
        {/* ════ LEFT – artwork + info + like ════ */}
        <div className="player__left">
          <div className="player__art-wrap">
            <img
              className="player__art"
              src={
                song?.posterUrl ||
                "https://via.placeholder.com/52x52/c8ead9/4caf8a?text=♫"
              }
              alt={song?.title || "No song"}
            />
            {isPlaying && <div className="player__art-ring" />}
          </div>

          <div className="player__meta">
            <p className="player__title">{song?.title || "No song loaded"}</p>
            {song?.mood && (
              <span className="player__mood-chip">{song.mood}</span>
            )}
          </div>

          <button
            className={`player__like ${liked ? "player__like--active" : ""}`}
            onClick={() => setLiked((l) => !l)}
            aria-label={liked ? "Unlike" : "Like"}
            title={liked ? "Unlike" : "Like"}
          >
            <IconHeart filled={liked} />
          </button>
        </div>

        {/* ════ CENTER – controls + progress ════ */}
        <div className="player__center">
          {/* Control row */}
          <div className="player__controls">
            {/* Shuffle */}
            <button
              className={`ctrl-btn ctrl-btn--icon ${shuffle ? "ctrl-btn--active" : ""}`}
              onClick={() => setShuffle((s) => !s)}
              title="Shuffle"
              aria-label="Shuffle"
            >
              <IconShuffle />
              {shuffle && <span className="ctrl-btn__dot" />}
            </button>

            {/* Skip back */}
            <button
              className="ctrl-btn ctrl-btn--skip"
              onClick={() => skip(-10)}
              title="Back 10s"
            >
              <IconSkipBack />
            </button>

            {/* Play / Pause */}
            <button
              className={`ctrl-btn ctrl-btn--play ${isPlaying ? "ctrl-btn--play-active" : ""}`}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>

            {/* Skip forward */}
            <button
              className="ctrl-btn ctrl-btn--skip"
              onClick={() => skip(10)}
              title="Forward 10s"
            >
              <IconSkipFwd />
            </button>

            {/* Repeat */}
            <button
              className={`ctrl-btn ctrl-btn--icon ${repeat !== "none" ? "ctrl-btn--active" : ""}`}
              onClick={cycleRepeat}
              title={
                repeat === "none"
                  ? "Repeat off"
                  : repeat === "all"
                    ? "Repeat all"
                    : "Repeat one"
              }
              aria-label="Repeat"
            >
              {repeat === "one" ? <IconRepeatOne /> : <IconRepeat />}
              {repeat !== "none" && <span className="ctrl-btn__dot" />}
            </button>
          </div>

          {/* Progress bar */}
          <div className="player__progress">
            <span className="player__time">{formatTime(currentTime)}</span>
            <div
              ref={progressRef}
              className="progress-track"
              onClick={seek}
              onMouseMove={onProgressHover}
              onMouseLeave={() => setHoveredTime(null)}
              role="slider"
              aria-label="Seek"
              aria-valuenow={Math.round(currentTime)}
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
            >
              {/* Buffer-style background fill */}
              <div
                className="progress-fill"
                style={{ width: `${progressPct}%` }}
              >
                <div className="progress-thumb" />
              </div>

              {/* Hover time tooltip */}
              {hoveredTime !== null && (
                <div className="progress-tooltip" style={{ left: hoverX }}>
                  {formatTime(hoveredTime)}
                </div>
              )}
            </div>
            <span className="player__time">{formatTime(duration)}</span>
          </div>
        </div>

        {/* ════ RIGHT – volume + speed ════ */}
        <div className="player__right">
          {/* Volume row */}
          <div className="player__vol-row">
            <button
              className="ctrl-btn ctrl-btn--icon"
              onClick={toggleMute}
              aria-label="Mute"
            >
              <VolumeIcon />
            </button>
            <div className="vol-track">
              <div
                className="vol-fill"
                style={{ width: `${effectiveVol * 100}%` }}
              />
              <input
                type="range"
                className="vol-slider"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted && Number(e.target.value) > 0) setIsMuted(false);
                }}
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Speed pill */}
          <SpeedControl />
        </div>
      </div>
    </div>
  );
};

/* ─── Speed control sub-component ─────────────────── */
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const SpeedControl = () => {
  const [speed, setSpeed] = useState(1);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="speed-ctrl" ref={ref}>
      <button
        className={`speed-btn ${open ? "speed-btn--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Playback speed"
      >
        {speed === 1 ? "1× Speed" : `${speed}×`}
      </button>
      {open && (
        <div className="speed-menu">
          {SPEEDS.map((s) => (
            <button
              key={s}
              className={`speed-opt ${speed === s ? "speed-opt--active" : ""}`}
              onClick={() => {
                setSpeed(s);
                /* apply to audio via parent would need context */ setOpen(
                  false,
                );
              }}
            >
              {s === 1 ? "Normal" : `${s}×`}
              {speed === s && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Player;
